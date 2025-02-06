import crypto from "crypto";
import {
  getAllShortLinks,
  getShortLinkById,
  getShortLinkByShortCode,
  insertShortLink,
  updateShortLink,
} from "../services/shortener.services.js";
import {
  editShortLinkSchema,
  newShortLinkSchema,
} from "../validators/shortener.validators.js";
import { z } from "zod";

export async function getShortenerPage(req, res) {
  try {
    if (!req.user) return res.redirect("/auth/login");

    const links = await getAllShortLinks(req.user.id);

    return res.render("index", {
      links,
      host: req.host,
      errors: req.flash("errors"),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

export async function postShortenLink(req, res) {
  try {
    if (!req.user) return res.redirect("/auth/login");

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

    await insertShortLink({
      url,
      shortCode: finalShortCode,
      userId: req.user.id,
    });

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

export async function getEditPage(req, res) {
  if (!req.user) return res.redirect("/auth/login");

  const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
  if (error) return res.redirect("/404");

  try {
    const shortLink = await getShortLinkById(id);
    if (!shortLink) return res.redirect("/404");

    return res.render("edit-shortlink", {
      id: shortLink.id,
      url: shortLink.url,
      shortCode: shortLink.shortCode,
      errors: req.flash("errors"),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

export async function postEditLink(req, res) {
  if (!req.user) return res.redirect("/auth/login");

  const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
  if (error) return res.redirect("/404");

  try {
    const shortLink = await getShortLinkById(id);
    if (!shortLink || shortLink.userId !== req.user.id)
      return res.redirect("/404");

    const { data, error } = editShortLinkSchema.safeParse(req.body);

    if (error) {
      const errorMessages = error.errors.map((err) => err.message);
      req.flash("errors", errorMessages);
      return res.redirect(`/edit/${id}`);
    }

    await updateShortLink({
      id,
      url: data.url,
      shortCode: data.shortCode,
      userId: req.user.id,
    });

    return res.redirect("/");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      req.flash("errors", "Shortcode already exists, please choose another");
      return res.redirect(`/edit/${id}`);
    }

    console.error(err);
    return res.status(500).send("Internal server error");
  }
}
