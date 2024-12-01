import { ShortLink } from "../models/shortener.model.js";
import crypto from "crypto";

export async function getShortenerPage(req, res) {
  try {
    const links = await ShortLink.find();

    return res.render("index", {
      title: "<strong>Thapa Technical</strong>",
      description: "<code>Hey, welcome to my channel</code>",
      languages: ["HTML", "CSS", "JavaScript"],
      links,
      role: "user",
      host: req.host,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

export async function postShortenLink(req, res) {
  try {
    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    const link = await ShortLink.findOne({ shortCode: finalShortCode });

    if (link) {
      return res
        .status(400)
        .send(
          '<h1>Url with that shortcode already exists, please choose another <a href="/">Go Back</a></h1>'
        );
    }

    await ShortLink.create({ url, shortCode: finalShortCode });

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

export async function redirectToShortLink(req, res) {
  try {
    const { shortCode } = req.params;
    const link = await ShortLink.findOne({ shortCode: shortCode });

    if (!link) return res.redirect("/404");

    return res.redirect(link.url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}
