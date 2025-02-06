import { and, eq } from "drizzle-orm";
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

export async function getShortLinkById(id) {
  const [shortLink] = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.id, id));

  return shortLink;
}

export async function insertShortLink({ url, shortCode, userId }) {
  return db.insert(shortLinksTable).values({ url, shortCode, userId });
}

export async function updateShortLink({ id, url, shortCode, userId }) {
  return db
    .update(shortLinksTable)
    .set({ url, shortCode })
    .where(and(eq(shortLinksTable.id, id), eq(shortLinksTable.userId, userId)));
}

export async function deleteShortLink({ id, userId }) {
  return db
    .delete(shortLinksTable)
    .where(and(eq(shortLinksTable.id, id), eq(shortLinksTable.userId, userId)));
}
