export function getLoginPage(req, res) {
  res.render("auth/login");
}

export function postLogin(req, res) {
  // It by default includes path=/ so we don't have to do it.
  res.cookie("isLoggedIn", true);
  res.redirect("/");
}

export function getRegisterPage(req, res) {
  res.render("auth/register");
}

export function postRegister(req, res) {
  console.log(req.body);
  res.redirect("/");
}
