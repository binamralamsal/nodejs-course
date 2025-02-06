import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { shortLinksTable } from "../drizzle/schema.js";

export async function getAllShortLinks(userId) {
  return db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.userId, userId));
}

export async function getShortLinkByShortCode(shortCode) {
  const [shortLink] = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.shortCode, shortCode));

  return shortLink;
}

export async function insertShortLink({ url, shortCode, userId }) {
  return db.insert(shortLinksTable).values({ url, shortCode, userId });
}
