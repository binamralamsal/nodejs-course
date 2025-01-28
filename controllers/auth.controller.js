import {
  createUser,
  generateJWTToken,
  getUserByEmail,
  hashPassword,
  verifyJWTToken,
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

  // as we all know that this is not secure, as anyone can change the cookie value, and we don't know for which user it is. So, we are going to use jsonwebtoken for this.

  const token = generateJWTToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });
  res.cookie("access_token", token);

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

// This is auth protected route.
export async function getMe(req, res) {
  const token = req.cookies.access_token;
  if (!token) return res.send("Not logged in");

  try {
    // If the JWT token is altered by client, or it has expired, it will throw error.
    const decodedToken = verifyJWTToken(token);
    // We get the data that we passed while creating the token.
    // We didn't need to use database for this.
    console.log(decodedToken);

    return res.send(
      `<h1>Hey ${decodedToken.name} - ${decodedToken.email}</h1>`
    );
  } catch (err) {
    return res.send("Not logged in");
  }
}
