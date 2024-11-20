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
app.use(express.urlencoded({ extended: true }));

app.get("/products", (req, res) => {
  // query parameters or search parameters are optional parameters which you can access in any route
  // you can pass query parameters like this /products?page=3
  // to pass multiple query parameters you can separate all of them with &
  // /products?page=3&limit=10
  // then you can access query parameters using req.query in express.js
  console.log(req.query);
  return res.send("<h1>Products Page</h1>");
});

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
