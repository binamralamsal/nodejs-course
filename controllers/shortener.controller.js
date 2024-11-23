import { loadLinks, saveLinks } from "../models/shortener.model.js";

export async function getShortenerPage(req, res) {
  try {
    const links = await loadLinks();

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
}

export async function redirectToShortLink(req, res) {
  try {
    const { shortCode } = req.params;
    const links = await loadLinks();

    // Rendering 404 template directly here is also possible, but it's tedious if you have to do in multiple places.
    // This will redirect to a page which doesn't exist hence creating 404 error.
    // We will learn about better way in future with error handlers.
    if (!links[shortCode]) return res.redirect("/404");

    return res.redirect(links[shortCode]);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}
