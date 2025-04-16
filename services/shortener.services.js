import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { shortLinksTable } from "../drizzle/schema.js";

// limit, and offset are set to 10, and 0 respectively by default.
export async function getAllShortLinks({ userId, limit = 10, offset = 0 }) {
  const conditions = eq(shortLinksTable.userId, userId);

  const shortLinks = await db
    .select()
    .from(shortLinksTable)
    .where(conditions)
    .orderBy(desc(shortLinksTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ totalCount }] = await db
    .select({ totalCount: count() })
    .from(shortLinksTable)
    .where(conditions);

  return { shortLinks, totalCount };
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
