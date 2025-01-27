import { createUser, getUserByEmail } from "../services/auth.services.js";

export function getLoginPage(req, res) {
  res.render("auth/login");
}

export async function postLogin(req, res) {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) return res.redirect("/auth/login");

  if (user.password !== password) return res.redirect("/auth/login");

  res.cookie("isLoggedIn", true);
  res.redirect("/");
}

export function getRegisterPage(req, res) {
  res.render("auth/register");
}

export async function postRegister(req, res) {
  const { name, email, password } = req.body;
  const userExists = await getUserByEmail(req.body);

  if (userExists) return res.redirect("/auth/register");

  const [user] = await createUser({ name, email, password });
  console.log(user);

  res.redirect("/auth/login");
}
