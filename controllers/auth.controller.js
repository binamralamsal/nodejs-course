import { sendEmail } from "../lib/nodemailer.js";
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
} from "../services/auth.services.js";
import {
  loginUserSchema,
  registerUserSchema,
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
    name: user.name,
    email: user.email,
    sessionId: session.id,
    isEmailValid: user.isEmailValid,
  });
  const refreshToken = createRefreshToken(session.id);
  setAuthCookies({ res, accessToken, refreshToken });

  res.redirect("/");
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

  const randomToken = generateRandomToken();

  await insertVerifyEmailToken({ userId: req.user.id, token: randomToken });

  const verifyEmailLink = createVerifyEmailLink({
    email: req.user.email,
    token: randomToken,
  });

  // we aren't awaiting it because we don't want to make the user wait for email to be sent.
  sendEmail({
    subject: "Verify your email",
    html: `
      <h1>Click the link below to verify your email</h1>
      <p>You can use this token: <code>${randomToken}</code></p>
      <a href="${verifyEmailLink}">Verify Email</a>
    `,
    to: req.user.email,
  }).catch(console.error);

  res.redirect("/auth/verify-email");
}
