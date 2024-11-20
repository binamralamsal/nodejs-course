import express from "express";
import { env } from "./env.js";
import path from "path";

const app = express();

app.get("/", (req, res) => {
  // We are using newer version of Node.js where import.meta.dirname is available, in older versions.
  // const __filename = new URL(import.meta.url).pathname; // import.meta.url was available in previous versions too.
  // const __dirname = path.dirname(__filename);
  // if you are using commonjs then you can just use __dirname instead of all above.
  const homePagePath = path.join(import.meta.dirname, "public", "index.html");
  res.sendFile(homePagePath);
});

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
