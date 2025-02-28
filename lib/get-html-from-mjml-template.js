import fs from "fs/promises";
import ejs from "ejs";
import mjml2html from "mjml";
import path from "path";

export async function getHtmlFromMjmlTemplate(template, data) {
  const mjmlTemplate = await fs.readFile(
    path.join(import.meta.dirname, "..", "emails", `${template}.mjml`),
    "utf-8"
  );
  const filledTemplate = ejs.render(mjmlTemplate, data);

  return mjml2html(filledTemplate).html;
}
