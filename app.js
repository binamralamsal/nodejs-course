import express from "express";
import { env } from "./env.js";
import path from "path";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.use((req, res) => {
  // return res.status(404).send("<h1>404 Page</h1>")

  return res
    .status(404)
    .sendFile(path.join(import.meta.dirname, "views", "404.html"));
});

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
