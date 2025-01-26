export function getLoginPage(req, res) {
  res.render("auth/login");
}

export function postLogin(req, res) {
  // Syntax for setting cookies. You can also set multiple times
  // If we don't set Path then it just sets Path to /auth/login
  res.setHeader("Set-Cookie", "isLoggedIn=true; Path=/;");
  // res.setHeader("Set-Cookie", ["isLoggedIn=true", "name=John"]);
  res.redirect("/");
}

export function getRegisterPage(req, res) {
  res.render("auth/register");
}
