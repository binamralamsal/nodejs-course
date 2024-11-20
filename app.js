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
// if you want only after a path to handle all files inside public dir then you have to use it.
// app.use("/public", express.static("public"));

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
