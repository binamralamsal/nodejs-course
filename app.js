import express from "express";

import { env } from "./config/env.js";
import { shortenerRoutes } from "./routes/shortener.routes.js";
import { get404 } from "./controllers/error.controller.js";
import { dbClient } from "./config/db-client.js";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/404", get404);
app.use(shortenerRoutes);

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
