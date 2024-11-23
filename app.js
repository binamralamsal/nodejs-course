import express from "express";

import { env } from "./env.js";
import { shortenerRoutes } from "./routes/shortener.routes.js";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// app.set("views", "./views"); // views folder is used by default from current directory
// so it's not needed, but you can assign another folder if you have.

app.use(shortenerRoutes);

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
