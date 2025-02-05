import express from "express";
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

// This must be after cookieParser middleware.
app.use(verifyAuthentication);
app.use((req, res, next) => {
  // setting something in res.locals will send that
  // to the views, so we can access it in views.
  // we can access the user object in views automatically.
  res.locals.user = req.user;
  return next();
});

app.use("/404", get404);
app.use("/auth", authRoutes);
app.use(shortenerRoutes);

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
