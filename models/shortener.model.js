import { SHORTLINKS_COLLECTION_NAME } from "../config/constants.js";
import { getDB } from "../config/db.js";

function getShortenerCollection() {
  const db = getDB();
  return db.collection(SHORTLINKS_COLLECTION_NAME);
}

export async function getLinks() {
  const collection = getShortenerCollection();
  return await collection.find().toArray();
}

export async function insertLink(link) {
  const collection = getShortenerCollection();
  await collection.insertOne(link);
}

export async function getLinkByShortCode(shortCode) {
  const collection = getShortenerCollection();
  return await collection.findOne({ shortCode: shortCode });
}
