import { MongoClient } from "mongodb";
import { env } from "./env.js";

const client = new MongoClient(env.MONGODB_URI);

// what we are doing is to improve db connection logic.\
// first assigning it to a variable.
let dbInstance = null;

export async function connectDB() {
  // when first express server starts, we are calling connectdb, initially dbInstance is null, so it will not return here.
  // but if it has already been connected then we have dbInstance in that variable which we are returning here.
  if (dbInstance) {
    return dbInstance;
  }

  await client.connect();
  // we assign it to a variable so that if someone uses this connectDB() again in future then we will return dbinstance.
  dbInstance = client.db(env.MONGODB_DATABASE_NAME);
  console.log("MongoDB connected successfully!");
  return dbInstance;
}

export function getDB() {
  // this will error if db instance doesn't exist
  if (!dbInstance) {
    throw new Error("Database not connected. Please call connectDB() first.");
  }
  return dbInstance;
}
