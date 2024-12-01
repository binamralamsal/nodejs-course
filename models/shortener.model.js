import { dbClient } from "../config/db-client.js";
import { env } from "../config/env.js";
import { SHORTLINKS_COLLECTION_NAME } from "../config/constants.js";

const db = dbClient.db(env.MONGODB_DATABASE_NAME);
const shortenerCollection = db.collection(SHORTLINKS_COLLECTION_NAME);

export async function getLinks() {
  // this is optional, it will be called automatically even if you don't call it.
  // await dbClient.connect();
  return await shortenerCollection.find().toArray();
}

export async function insertLink(link) {
  await shortenerCollection.insertOne(link);
}

export async function getLinkByShortCode(shortCode) {
  return await shortenerCollection.findOne({ shortCode: shortCode });
}
