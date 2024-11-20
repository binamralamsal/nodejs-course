import express from "express";
import { env } from "./env.js";
import path from "path";

const app = express();

// to add middleware like express.static() you have to pass it inside app.use()
// it requires a folder from your current directory, which for us is public.
// since we have index.html inside public, we don't need separate file to handle homepage.
// It will use index.html
// You can also add images inside this folder and you will see that you can access it using /file-name.extension
// which means we can use css file now.
app.use(express.static("public"));

// You can assign route parameters with colon (:) and key.
app.get("/profile/:username", (req, res) => {
  // then you can access it using req.params.key
  console.log(req.params);

  res.send(`<h1>Profile ${req.params.username}</h1>`);
});

// if you want multiple route parameters then also you can use it.
app.get("/profile/:username/article/:slug", (req, res) => {
  console.log(req.params);

  res.send(`<h1>Article ${req.params.slug} by ${req.params.username}</h1>`);
});

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
