import { relations } from "drizzle-orm";
import { mysqlTable, varchar, int, timestamp } from "drizzle-orm/mysql-core";

export const shortLinksTable = mysqlTable("short_links", {
  id: int("id").autoincrement().primaryKey(),
  shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
  url: varchar("url", { length: 255 }).notNull(),
  // added these 3 fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),
});

export const usersTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// A user can have many short links
export const usersRelations = relations(usersTable, ({ many }) => ({
  shortLinks: many(shortLinksTable),
}));

// A short link belongs to a user
export const shortLinksRelations = relations(shortLinksTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [shortLinksTable.userId],
    references: [usersTable.id],
  }),
}));
