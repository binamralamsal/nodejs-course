import {
  createUser,
  generateJWTToken,
  getUserByEmail,
  hashPassword,
  verifyPassword,
} from "../services/auth.services.js";

export function getLoginPage(req, res) {
  if (req.user) return res.redirect("/");

  res.render("auth/login", { errors: req.flash("errors") });
}

export async function postLogin(req, res) {
  if (req.user) return res.redirect("/");

  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    req.flash("errors", "Invalid email or password");
    return res.redirect("/auth/login");
  }

  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) {
    req.flash("errors", "Invalid email or password");
    return res.redirect("/auth/login");
  }

  const token = generateJWTToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  res.cookie("access_token", token);

  res.redirect("/");
}

export function getRegisterPage(req, res) {
  if (req.user) return res.redirect("/");

  res.render("auth/register", { errors: req.flash("errors") });
}

export async function postRegister(req, res) {
  if (req.user) return res.redirect("/");

  const { name, email, password } = req.body;
  const userExists = await getUserByEmail(email);

  if (userExists) {
    req.flash("errors", "User already exists");
    return res.redirect("/auth/register");
  }

  const hashedPassword = await hashPassword(password);
  const [user] = await createUser({ name, email, password: hashedPassword });
  console.log(user);

  res.redirect("/auth/login");
}

export async function getMe(req, res) {
  if (!req.user) return res.send("Not logged in");

  return res.send(`<h1>Hey ${req.user.name} - ${req.user.email}</h1>`);
}

export async function logoutUser(req, res) {
  res.clearCookie("access_token");
  res.redirect("/");
}
