import { drizzle } from "drizzle-orm/mysql2";
import { env } from "./env.js";

export const db = drizzle(env.DATABASE_URL, {
  logger: env.NODE_ENV === "development",
});
