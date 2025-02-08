import { eq } from "drizzle-orm";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import {
  ACCESS_TOKEN_EXPIRY,
  MILLISECONDS_PER_SECOND,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constants.js";
import { db } from "../config/db.js";
import { sessionsTable, usersTable } from "../drizzle/schema.js";
import { env } from "../config/env.js";

export async function getUserByEmail(email) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
}

export async function createUser({ name, email, password }) {
  const [user] = await db
    .insert(usersTable)
    .values({ name, email, password })
    .$returningId()[0];

  return user;
}

export async function createSession(userId, { ip, userAgent }) {
  const [session] = await db
    .insert(sessionsTable)
    .values({
      userId,
      userAgent: userAgent,
      ip: ip,
    })
    .$returningId();

  return session;
}

export async function hashPassword(password) {
  return argon2.hash(password);
}

export async function verifyPassword(hash, password) {
  return argon2.verify(hash, password);
}

export function createAccessToken({ id, name, email, sessionId }) {
  // return jwt.sign({ id, name, email, sessionId }, env.JWT_SECRET, {
  //   expiresIn: "15m",
  // });
  return jwt.sign({ id, name, email, sessionId }, env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,
  });
}

export function createRefreshToken(sessionId) {
  // return jwt.sign({ sessionId }, env.JWT_SECRET, {
  //   expiresIn: "1w",
  // });
  return jwt.sign({ sessionId }, env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,
  });
}

export function verifyJWTToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
