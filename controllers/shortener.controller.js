import crypto from "crypto";
import {
  getAllShortLinks,
  getShortLinkByShortCode,
  insertShortLink,
} from "../services/shortener.services.js";
import { newShortLinkSchema } from "../validators/shortener.validators.js";

export async function getShortenerPage(req, res) {
  try {
    const links = await getAllShortLinks();

    return res.render("index", {
      links,
      host: req.host,
      // This will pass error to the route.
      errors: req.flash("errors"),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

export async function postShortenLink(req, res) {
  try {
    const { data, error } = newShortLinkSchema.safeParse(req.body);

    if (error) {
      const errorMessages = error.errors.map((err) => err.message);
      req.flash("errors", errorMessages);
      return res.redirect("/");
    }

    const { url, shortCode } = data;

    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    const link = await getShortLinkByShortCode(finalShortCode);

    if (link) {
      // This will set error temporarily
      req.flash(
        "errors",
        "Url with that shortcode already exists, please choose another"
      );
      return res.redirect("/");
    }

    await insertShortLink({ url, shortCode: finalShortCode });

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

export async function redirectToShortLink(req, res) {
  try {
    const { shortCode } = req.params;
    const link = await getShortLinkByShortCode(shortCode);

    if (!link) return res.redirect("/404");

    return res.redirect(link.url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}
