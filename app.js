import express from "express";

import { env } from "./env.js";
import { shortenerRoutes } from "./routes/shortener.routes.js";
import { get404 } from "./controllers/error.controller.js";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Since shortenerRoute uses shortcode, we are using this method for now. We will switch to better method in future.
app.use("/404", get404);
app.use(shortenerRoutes);

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
