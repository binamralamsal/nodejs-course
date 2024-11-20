import express from "express";
import { env } from "./env.js";

const app = express();

app.use(express.static("public"));
// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));
// when you use extended: true, it uses https://www.npmjs.com/package/qs (qs) library for parsing query strings
// It has extended support for parsing req.body;
// you can pass as an object, arrays, and so on, let's see an example.
// got to index.html and upate all name to user[email] and user[message]
// now you can see difference between extended and without extended.

// If you are using default GET method for form, then you can use app.get
// and access using req.query as GET form sends data in URL query.
// req.query can be used for any search params that you pass.
// app.get("/contact", (req, res) => {
//   const { name, message } = req.query;
//   console.log(name, message);
//   res.redirect("/");
// });

app.post("/contact", (req, res) => {
  // for post request in form, you can access via req.body;
  // make sure to use express.urlencoded() middleware
  console.log(req.body);
  res.redirect("/");
});

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
