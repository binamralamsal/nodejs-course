import express from "express";
import { env } from "./env.js";

const app = express();

// We have learnt that browser sends GET request for getting the webpage.
// Express has methods like app.get, app.post, which we can use to handle.
// First parameter is path which you want to handle.
// Second parameter is callback function which takes request and resposne as parameter
// Syntax
/*
 * app.get(path: string, (req: Request, res: Response) => {})
 */
app.get("/", (req, res) => {
  // Express.js will handle Content-Type automatically based on what you send.
  // Here, we are sending HTML, hence express will automatically set Content-Type of response as HTML
  // return res.send("<h1>Hello World</h1>");
  // You can only send one response from a handler, so it's best idea to use return with it, so it doesn't move down.
  // This will set Content-Type as text/plain
  return res.send("Home Page");
});

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.get("/api", (req, res) => {
  // This will automatically set Content-Type as json and we also don't have to use JSON.stringify()
  return res.send({ message: "Hello World" });
});

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
