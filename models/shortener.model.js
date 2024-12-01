import { db } from "../config/db.js";

export async function getAllShortLinks() {
  const [rows] = await db.execute("SELECT * FROM short_links");
  return rows;
}

export async function insertShortLink({ shortCode, url }) {
  const [result] = await db.execute(
    "INSERT INTO short_links (short_code, url) VALUES (?, ?)",
    [shortCode, url]
  );
  return result;
}

export async function getShortLinkByShortCode(shortCode) {
  const [rows] = await db.execute(
    "SELECT * FROM short_links WHERE short_code = ?",
    [shortCode]
  );

  if (rows.length > 0) {
    return rows[0];
  } else {
    return null;
  }
}
