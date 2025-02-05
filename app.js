import express from "express";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { shortenerRoutes } from "./routes/shortener.routes.js";
import { get404 } from "./controllers/error.controller.js";
import { authRoutes } from "./routes/auth.routes.js";
import { verifyAuthentication } from "./middlewares/verify-authentication.middleware.js";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(cookieParser());
// Connect flash uses express sessions to store messages.
// This package can be used for many other use cases including authentication.
// But we aren't using it for authentication in this project.
// Hence, it doesn't matter if we use a strong or weak secret here.
app.use(
  session({ secret: "my-secret", resave: true, saveUninitialized: false })
);
app.use(flash());

app.use(verifyAuthentication);
app.use((req, res, next) => {
  res.locals.user = req.user;
  return next();
});

app.use("/404", get404);
app.use("/auth", authRoutes);
app.use(shortenerRoutes);

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
