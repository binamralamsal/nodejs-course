import {
  createUser,
  getUserByEmail,
  hashPassword,
  verifyPassword,
} from "../services/auth.services.js";

export function getLoginPage(req, res) {
  res.render("auth/login");
}

export async function postLogin(req, res) {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) return res.redirect("/auth/login");

  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) return res.redirect("/auth/login");

  res.cookie("isLoggedIn", true);
  res.redirect("/");
}

export function getRegisterPage(req, res) {
  res.render("auth/register");
}

export async function postRegister(req, res) {
  const { name, email, password } = req.body;
  const userExists = await getUserByEmail(email);

  if (userExists) return res.redirect("/auth/register");

  const hashedPassword = await hashPassword(password);
  const [user] = await createUser({ name, email, password: hashedPassword });
  console.log(user);

  res.redirect("/auth/login");
}
