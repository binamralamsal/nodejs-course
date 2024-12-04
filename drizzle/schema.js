import { mysqlTable, varchar, int, unique } from "drizzle-orm/mysql-core";

export const shortLinksTable = mysqlTable("short_links", {
  id: int("id").autoincrement().primaryKey(),
  shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
  url: varchar("url", { length: 255 }).notNull(),
});
