import express from "express";
import { env } from "./env.js";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_FILE = path.join("data", "links.json");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const file = await fs.readFile(path.join("views", "index.html"));
    const links = await loadLinks();

    const content = file.toString().replaceAll(
      "{{ shortened_urls }}",
      Object.entries(links)
        .map(
          ([shortCode, url]) =>
            `<li><a href="/${shortCode}" target="_blank">${req.host}/${shortCode}</a> -> ${url}</li>`
        )
        .join("")
    );
    return res.send(content);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// You can also use same path as long as method is different.
app.post("/", async (req, res) => {
  try {
    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    const links = await loadLinks();

    if (links[finalShortCode]) {
      return res
        .status(400)
        .send(
          '<h1>Url with that shortcode already exists, please choose another <a href="/">Go Back</a></h1>'
        );
    }

    links[finalShortCode] = url;
    await saveLinks(links);

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const links = await loadLinks();

    if (!links[shortCode]) return res.status(404).send("404 error occured");

    return res.redirect(links[shortCode]);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

async function loadLinks() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
}

async function saveLinks(links) {
  await fs.writeFile(DATA_FILE, JSON.stringify(links));
}

app.listen(env.PORT, () => {
  console.log("Server starting on port 3000");
});
