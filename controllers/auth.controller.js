import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { getHtmlFromMjmlTemplate } from "../lib/get-html-from-mjml-template.js";
import { sendEmail } from "../lib/send-email.js";
import {
  createSession,
  createUser,
  createAccessToken,
  findUserByEmail,
  hashPassword,
  verifyPassword,
  createRefreshToken,
  clearSession,
  setAuthCookies,
  findUserById,
  findVerificationEmailToken,
  verifyUserEmail,
  clearVerifyEmailTokens,
  sendNewVerifyEmailLink,
  updateUserProfile,
  updateUserPassword,
  createResetPasswordLink,
  getResetPasswordToken,
  clearPasswordResetToken,
  getUserWithOauthId,
  linkUserWithOauth,
  createUserWithOauth,
} from "../services/auth.services.js";

import {
  changePasswordSchema,
  editProfileSchema,
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  verifyEmailInformationSchema,
} from "../validators/auth.validators.js";
import { google } from "../lib/oauth/google.js";
import { OAUTH_EXCHANGE_EXPIRY } from "../config/constants.js";
import { github } from "../lib/oauth/github.js";

export function getLoginPage(req, res) {
  if (req.user) return res.redirect("/");

  res.render("auth/login", { errors: req.flash("errors") });
}

export async function postLogin(req, res) {
  if (req.user) return res.redirect("/");

  const { data, error } = loginUserSchema.safeParse(req.body);
  if (error) {
    const errorMessages = error.errors.map((err) => err.message);
    req.flash("errors", errorMessages);
    return res.redirect("/auth/login");
  }

  const { email, password } = data;

  const user = await findUserByEmail(email);
  if (!user) {
    req.flash("errors", "Invalid email or password");
    return res.redirect("/auth/login");
  }

  if (!user.password) {
    // if password is null
    req.flash(
      "errors",
      "You have created account using social login. Please login with your social account."
    );
    return res.redirect("/auth/login");
  }

  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) {
    req.flash("errors", "Invalid email or password");
    return res.redirect("/auth/login");
  }

  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = createAccessToken({
    id: user.id,
    name: user.name,
    email: user.email,
    sessionId: session.id,
    isEmailValid: user.isEmailValid,
  });
  const refreshToken = createRefreshToken(session.id);
  setAuthCookies({ res, accessToken, refreshToken });

  res.redirect("/");
}

export function getRegisterPage(req, res) {
  if (req.user) return res.redirect("/");

  res.render("auth/register", { errors: req.flash("errors") });
}

export async function postRegister(req, res) {
  if (req.user) return res.redirect("/");

  const { data, error } = registerUserSchema.safeParse(req.body);
  if (error) {
    const errorMessages = error.errors.map((err) => err.message);
    req.flash("errors", errorMessages);
    return res.redirect("/auth/register");
  }

  const { email, password, name } = data;

  const userExists = await findUserByEmail(email);

  if (userExists) {
    req.flash("errors", "User already exists");
    return res.redirect("/auth/register");
  }

  const hashedPassword = await hashPassword(password);
  const user = await createUser({ name, email, password: hashedPassword });

  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = createAccessToken({
    id: user.id,
    name,
    email,
    sessionId: session.id,
    isEmailValid: false,
  });
  const refreshToken = createRefreshToken(session.id);
  setAuthCookies({ res, accessToken, refreshToken });

  // sending verify email link in register
  await sendNewVerifyEmailLink({ email, userId: user.id });

  // redirect to verify email page after registering
  res.redirect("/auth/verify-email");
}

export async function getMe(req, res) {
  if (!req.user) return res.send("Not logged in");

  return res.send(`<h1>Hey ${req.user.name} - ${req.user.email}</h1>`);
}

export async function logoutUser(req, res) {
  if (!req.user) return res.send("Not logged in");

  await clearSession(req.user.sessionId);

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.redirect("/");
}

export async function getProfilePage(req, res) {
  if (!req.user) return res.redirect("/auth/login");

  // You might be wondering why we aren't using req.user
  // that's because it's a profile page, and we want it to be updated
  // without having to wait for 15 min of access token refresh
  // so we're fetching the user from the database
  // other routes can use req.user
  const user = await findUserById(req.user.id);
  if (!user) return res.redirect("/auth/login");

  res.render("auth/profile", {
    user: {
      name: user.name,
      email: user.email,
      isEmailValid: user.isEmailValid,
      hasPassword: Boolean(user.password), // Since not all users will have password, we will make sure that users can set their password
      id: user.id,
    },
  });
}

export async function getVerifyEmailPage(req, res) {
  if (!req.user || req.user?.isEmailValid) return res.redirect("/");

  res.render("auth/verify-email", {
    email: req.user.email,
    errors: req.flash("errors"),
  });
}

export async function resendVerificationLink(req, res) {
  if (!req.user || req.user.isEmailValid) return res.redirect("/");

  // we are doing this to reuse in register
  await sendNewVerifyEmailLink({ email: req.user.email, userId: req.user.id });

  res.redirect("/auth/verify-email");
}

export async function verifyEmailToken(req, res) {
  // we aren't checking auth status because we want user to verify their email even if they're not logged in
  const { data, error } = verifyEmailInformationSchema.safeParse(req.query);
  if (error) {
    req.flash("errors", "Verification link invalid or expired!");
    return res.redirect("/auth/profile");
  }

  const [token] = await findVerificationEmailToken(data);

  // we are checking whether token is available in database directly in sql query, so we don't need to do in javascript.
  if (!token) {
    req.flash("errors", "Verification link invalid or expired!");
    return res.redirect("/auth/profile");
  }

  await verifyUserEmail(token.email); // you can also use data.email
  // we want to clear all tokens of this user after being verified.
  // we aren't awaiting it such that it doesn't make user wait to get response.
  clearVerifyEmailTokens(token.email).catch(console.error);

  return res.redirect("/auth/profile");
}

export async function getEditProfilePage(req, res) {
  if (!req.user) return res.redirect("/");

  const user = await findUserById(req.user.id);
  if (!user) return res.redirect("/");

  return res.render("auth/edit-profile", {
    name: user.name,
    errors: req.flash("errors"),
  });
}

export async function postEditProfile(req, res) {
  if (!req.user) return res.redirect("/");

  const { data, error } = editProfileSchema.safeParse(req.body);
  if (error) {
    const errorMessages = error.errors.map((err) => err.message);
    req.flash("errors", errorMessages);
    return res.redirect("/auth/edit-profile");
  }

  await updateUserProfile(req.user.id, data);

  return res.redirect("/auth/profile");
}

export async function getChangePasswordPage(req, res) {
  if (!req.user) return res.redirect("/");

  return res.render("auth/change-password", {
    errors: req.flash("errors"),
  });
}

export async function postChangePassword(req, res) {
  if (!req.user) return res.redirect("/");

  const { data, error } = changePasswordSchema.safeParse(req.body);
  if (error) {
    const errorMessages = error.errors.map((err) => err.message);
    req.flash("errors", errorMessages);
    return res.redirect("/auth/change-password");
  }

  const { currentPassword, newPassword } = data;

  const user = await findUserById(req.user.id);
  if (!user) {
    req.flash("errors", "Invalid email or password");
    return res.redirect("/auth/change-password");
  }

  const isPasswordValid = await verifyPassword(user.password, currentPassword);
  if (!isPasswordValid) {
    req.flash("errors", "Current Password that you entered is invalid");
    return res.redirect("/auth/change-password");
  }

  await updateUserPassword({ userId: user.id, newPassword });

  return res.redirect("/auth/profile");
}

export async function getSetPasswordPage(req, res) {
  if (!req.user) return res.redirect("/");

  return res.render("auth/set-password", {
    errors: req.flash("errors"),
  });
}

export async function getForgotPasswordPage(req, res) {
  res.render("auth/forgot-password", {
    formSubmitted: req.flash("formSubmitted")[0],
    errors: req.flash("errors"),
  });
}

export async function postForgotPassword(req, res) {
  const { data, error } = forgotPasswordSchema.safeParse(req.body);
  if (error) {
    const errorMessages = error.errors.map((err) => err.message);
    req.flash("errors", errorMessages);
    return res.redirect("/auth/reset-password");
  }

  const user = await findUserByEmail(data.email);
  if (user) {
    const resetPasswordLink = await createResetPasswordLink({
      userId: user.id,
    });

    const html = await getHtmlFromMjmlTemplate("reset-password-email", {
      name: user.name,
      link: resetPasswordLink,
    });

    sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html,
    });
  }

  req.flash("formSubmitted", true);
  res.redirect("/auth/reset-password");
}

export async function getResetPasswordPage(req, res) {
  const { token } = req.params;

  const passwordResetData = await getResetPasswordToken(token);
  if (!passwordResetData) return res.render("auth/wrong-reset-password-token");

  return res.render("auth/reset-password", {
    errors: req.flash("errors"),
    token,
  });
}

export async function postResetPassword(req, res) {
  const { token } = req.params;

  const passwordResetData = await getResetPasswordToken(token);
  if (!passwordResetData) return res.render("auth/wrong-reset-password-token");

  const { data, error } = resetPasswordSchema.safeParse(req.body);
  if (error) {
    const errorMessages = error.errors.map((err) => err.message);
    req.flash("errors", errorMessages);
    return res.redirect(`/auth/reset-password/${token}`);
  }

  await clearPasswordResetToken(passwordResetData.userId);
  await updateUserPassword({
    userId: passwordResetData.userId,
    newPassword: data.newPassword,
  });

  res.redirect("/auth/login");
}

export async function getGoogleLoginPage(req, res) {
  if (req.user) return res.redirect("/");

  // state is generally optional but a recommended value that we can pass to oauth clients.
  // oauth clients will send us same state in our callback which we will verify is whether equal to the one we created
  // this is done such that the user initiating the login with oauth is the same as the one which gets callback url or not
  const state = generateState();
  // code verifier is a required value that we pass to the oauth clients.
  // It's called "Proof key for code exchange" or PKCE
  // it was introduced in RFC 7636 to provide protection to oauth 2.0
  // the flow is basically like this:
  // first we will send code challenge to the authorization url by hashing the code verifier using a hash method
  // we will send both hash method and hashed value to the authorization url
  // then in callback when we have to get user details, we have to send the code verifier to the oauth client
  // oauth client will check whether the initial code challenge matches the hash of the code verifier sent.
  // if this sounds complex, don't worry we don't have to care about that
  // arctic will make it easier for us.
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid", // this is called scopes, here we are giving openid, and profile
    "profile", // openid gives tokens if needed, and profile gives user information
    // we are telling google about the information that we require from user.
    "email", // looks like I forgot to choose email
  ]);

  const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: OAUTH_EXCHANGE_EXPIRY,
    sameSite: "lax", // this is such that when google redirects to our website, cookies are maintained
  };

  res.cookie("google_oauth_state", state, cookieConfig);
  res.cookie("google_code_verifier", codeVerifier, cookieConfig);

  res.redirect(url.toString());
}

export async function getGoogleLoginCallback(req, res) {
  // google redirects with code, and state in query params
  // we will use code to find out the user
  const { code, state } = req.query;
  const {
    google_oauth_state: storedState,
    google_code_verifier: codeVerifier,
  } = req.cookies;

  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    req.flash(
      "errors",
      "Couldn't login with Google because of invalid login attempt. Please try again!"
    );
    return res.redirect("/auth/login");
  }

  let tokens;
  try {
    // arctic will verify the code given by google with code verifier internally
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    req.flash(
      "errors",
      "Couldn't login with Google because of invalid login attempt. Please try again!"
    );
    return res.redirect("/auth/login");
  }

  const claims = decodeIdToken(tokens.idToken());
  const { sub: googleUserId, name, email } = claims;

  // there are few things that we should do
  // Condition 1: User already exists with google's oauth linked
  // Condition 2: User already exists with the same email but google's oauth isn't linked
  // Condition 3: User doesn't exist.

  // if user is already linked then we will get the user
  let user = await getUserWithOauthId({
    provider: "google",
    email,
  });

  // if user exists but user is not linked with oauth
  if (user && !user.providerAccountId) {
    await linkUserWithOauth({
      userId: user.id,
      provider: "google",
      providerAccountId: googleUserId,
    });
  }

  // if user doesn't exist
  if (!user) {
    user = await createUserWithOauth({
      name,
      email,
      provider: "google",
      providerAccountId: googleUserId,
    });
  }

  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = createAccessToken({
    id: user.id,
    name: user.name,
    email: user.email,
    sessionId: session.id,
    isEmailValid: user.isEmailValid,
  });
  const refreshToken = createRefreshToken(session.id);
  setAuthCookies({ res, accessToken, refreshToken });

  res.redirect("/");
}

export async function getGitHubLoginPage(req, res) {
  if (req.user) return res.redirect("/");

  const state = generateState();
  // we want user's email, that's why we have user:email in scope.
  // it doesn't have code verifier
  const url = github.createAuthorizationURL(state, ["user:email"]);

  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    secure: true,
    maxAge: OAUTH_EXCHANGE_EXPIRY,
    sameSite: "lax",
  });

  return res.redirect(url.toString());
}

export async function getGitHubLoginCallback(req, res) {
  const { code, state } = req.query;
  const { github_oauth_state: storedState } = req.cookies;

  function handleFailedLogin() {
    req.flash(
      "errors",
      "Couldn't login with GitHub because of invalid login attempt. Please try again!"
    );
    return res.redirect("/auth/login");
  }

  if (!code || !state || !storedState || state !== storedState) {
    return handleFailedLogin();
  }

  let tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch {
    return handleFailedLogin();
  }

  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  if (!githubUserResponse.ok) return handleFailedLogin();
  const githubUser = await githubUserResponse.json();
  const { id: githubUserId, name } = githubUser;

  const githubEmailResponse = await fetch(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    }
  );
  if (!githubEmailResponse.ok) return handleFailedLogin();

  const emails = await githubEmailResponse.json();
  const email = emails.filter((e) => e.primary)[0].email; // In GitHub we can have multiple emails, but we only want primary email
  if (!email) return handleFailedLogin();

  let user = await getUserWithOauthId({
    provider: "github",
    email,
  });

  if (user && !user.providerAccountId) {
    await linkUserWithOauth({
      userId: user.id,
      provider: "github",
      providerAccountId: githubUserId,
    });
  }

  if (!user) {
    user = await createUserWithOauth({
      name,
      email,
      provider: "github",
      providerAccountId: githubUserId,
    });
  }

  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = createAccessToken({
    id: user.id,
    name: user.name,
    email: user.email,
    sessionId: session.id,
    isEmailValid: user.isEmailValid,
  });
  const refreshToken = createRefreshToken(session.id);
  setAuthCookies({ res, accessToken, refreshToken });

  res.redirect("/");
}
