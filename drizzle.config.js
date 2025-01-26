import { env } from "./config/env.js";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.js",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
