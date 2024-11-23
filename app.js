import express from "express";

import { env } from "./env.js";
import { shortenerRoutes } from "./routes/shortener.routes.js";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// You can either use the router directly without base path.
app.use(shortenerRoutes);
// If you do this, then all the routes inside this shortenerRoutes will
// start with /app
// app.use("/app", shortenerRoutes);

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
