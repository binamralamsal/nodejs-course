import { eq } from "drizzle-orm";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { db } from "../config/db.js";
import { usersTable } from "../drizzle/schema.js";
import { env } from "../config/env.js";

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

export function generateJWTToken({ id, name, email }) {
  return jwt.sign({ id, name, email }, env.JWT_SECRET, { expiresIn: "30d" });
}

export function verifyJWTToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
