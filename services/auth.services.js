import { eq } from "drizzle-orm";
import argon2 from "argon2";

import { db } from "../config/db.js";
import { usersTable } from "../drizzle/schema.js";

export async function getUserByEmail(email) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
}

export function createUser({ name, email, password }) {
  return db.insert(usersTable).values({ name, email, password }).$returningId();
}

export async function hashPassword(password) {
  return argon2.hash(password);
}

export async function verifyPassword(hash, password) {
  return argon2.verify(hash, password);
}
