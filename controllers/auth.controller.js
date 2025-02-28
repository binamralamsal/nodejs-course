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
  generateRandomToken,
  createVerifyEmailLink,
  insertVerifyEmailToken,
  findVerificationEmailToken,
  verifyUserEmail,
  clearVerifyEmailTokens,
  sendNewVerifyEmailLink,
  updateUserProfile,
  updateUserPassword,
} from "../services/auth.services.js";
import {
  changePasswordSchema,
  editProfileSchema,
  loginUserSchema,
  registerUserSchema,
  verifyEmailInformationSchema,
} from "../validators/auth.validators.js";

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
