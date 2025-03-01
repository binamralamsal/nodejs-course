import { and, eq, gte, lt, or, sql } from "drizzle-orm";
import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import {
  ACCESS_TOKEN_EXPIRY,
  MILLISECONDS_PER_SECOND,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constants.js";
import { db } from "../config/db.js";
import {
  oauthAccountsTable,
  passwordResetTokensTable,
  sessionsTable,
  usersTable,
  verifyEmailTokensTable,
} from "../drizzle/schema.js";
import { env } from "../config/env.js";
import { sendEmail } from "../lib/send-email.js";
import { getHtmlFromMjmlTemplate } from "../lib/get-html-from-mjml-template.js";

export async function findUserByEmail(email) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
}

export async function findUserById(id) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id));

  return user;
}

export async function createUser({ name, email, password }) {
  const [user] = await db
    .insert(usersTable)
    .values({ name, email, password })
    .$returningId();

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

export async function findSessionById(id) {
  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, id));

  return session;
}

export async function hashPassword(password) {
  return argon2.hash(password);
}

export async function verifyPassword(hash, password) {
  return argon2.verify(hash, password);
}

export function createAccessToken({
  id,
  name,
  email,
  sessionId,
  isEmailValid,
}) {
  return jwt.sign(
    { id, name, email, sessionId, isEmailValid },
    env.JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,
    }
  );
}

export function createRefreshToken(sessionId) {
  return jwt.sign({ sessionId }, env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,
  });
}

export function verifyJWTToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

export async function refreshTokens(refreshToken) {
  try {
    const decodedToken = verifyJWTToken(refreshToken);
    const currentSession = await findSessionById(decodedToken.sessionId);

    if (!currentSession || !currentSession.valid)
      throw new Error("Invalid session");

    const user = await findUserById(currentSession.userId);
    if (!user) throw new Error("Invalid user");

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailValid: user.isEmailValid,
      sessionId: currentSession.id,
    };

    const newAccessToken = createAccessToken(userInfo);
    const newRefreshToken = createRefreshToken(currentSession.id);

    return {
      newAccessToken,
      newRefreshToken,
      user: userInfo,
    };
  } catch {
    throw new Error("Invalid refresh token");
  }
}

export async function clearSession(sessionId) {
  return db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
}

export function setAuthCookies({ res, accessToken, refreshToken }) {
  const baseCookieConfig = { httpOnly: true, secure: true };

  res.cookie("access_token", accessToken, {
    ...baseCookieConfig,
    maxAge: ACCESS_TOKEN_EXPIRY,
  });
  res.cookie("refresh_token", refreshToken, {
    ...baseCookieConfig,
    maxAge: REFRESH_TOKEN_EXPIRY,
  });
}

export function generateRandomToken(digits = 8) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits;

  return crypto.randomInt(min, max).toString();
}

export function createVerifyEmailLink({ email, token }) {
  const uriEncodedEmail = encodeURIComponent(email);

  return `${env.FRONTEND_URL}/auth/verify-email-token?token=${token}&email=${uriEncodedEmail}`;
}

export async function insertVerifyEmailToken({ userId, token }) {
  // This will delete expired tokens of everyone
  await db.delete(verifyEmailTokensTable).where(
    or(
      lt(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`),
      eq(verifyEmailTokensTable.userId, userId) // I am deleting previous user tokens before inserting one
    )
  );

  return db.insert(verifyEmailTokensTable).values({ userId, token });
}

export async function findVerificationEmailToken({ email, token }) {
  return db
    .select({
      userId: usersTable.id,
      email: usersTable.email,
      token: verifyEmailTokensTable.token,
      expiresAt: verifyEmailTokensTable.expiresAt,
    })
    .from(verifyEmailTokensTable)
    .where(
      and(
        eq(verifyEmailTokensTable.token, token),
        eq(usersTable.email, email), // We are using innerJoin, hence we can use usersTable here.
        gte(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`) // Token should not be expired
        // You could basically check whether it's expired using javascript too, but I prefer to do it like this.
      )
    )
    .innerJoin(usersTable, eq(usersTable.id, verifyEmailTokensTable.userId)); // Joining users table to get user info
}

export async function verifyUserEmail(email) {
  return db
    .update(usersTable)
    .set({ isEmailValid: true })
    .where(eq(usersTable.email, email));
}

export async function clearVerifyEmailTokens(email) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return db
    .delete(verifyEmailTokensTable)
    .where(eq(verifyEmailTokensTable.userId, user.id));
}

// we are doing this to reuse in register
export async function sendNewVerifyEmailLink({ email, userId }) {
  const randomToken = generateRandomToken();

  await insertVerifyEmailToken({ userId: userId, token: randomToken });
  const verifyEmailLink = createVerifyEmailLink({
    email,
    token: randomToken,
  });

  const html = await getHtmlFromMjmlTemplate("verify-email", {
    code: randomToken,
    link: verifyEmailLink,
  });

  sendEmail({
    subject: "Verify your email",
    html: html,
    to: email,
  }).catch(console.error);
}

export async function updateUserProfile(id, { name }) {
  await db.update(usersTable).set({ name }).where(eq(usersTable.id, id));
}

export async function updateUserPassword({ userId, newPassword }) {
  const hashedPassword = await hashPassword(newPassword);

  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, userId));
}

export async function createResetPasswordLink({ userId }) {
  const randomToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
    .createHash("sha256")
    .update(randomToken)
    .digest("hex");

  await db
    .delete(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.userId, userId));

  await db.insert(passwordResetTokensTable).values({ userId, tokenHash });

  return `${env.FRONTEND_URL}/auth/reset-password/${randomToken}`;
}

export async function getResetPasswordToken(token) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const [data] = await db
    .select()
    .from(passwordResetTokensTable)
    .where(
      and(
        eq(passwordResetTokensTable.tokenHash, tokenHash),
        gte(passwordResetTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`) // it shouldn't be expired
      )
    );

  return data;
}

export async function clearPasswordResetToken(userId) {
  await db
    .delete(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.userId, userId));
}

export async function getUserWithOauthId({ email, provider }) {
  const [user] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      isEmailValid: usersTable.isEmailValid,
      providerAccountId: oauthAccountsTable.providerAccountId,
      provider: oauthAccountsTable.provider,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .leftJoin(
      oauthAccountsTable,
      and(
        eq(oauthAccountsTable.provider, provider),
        eq(oauthAccountsTable.userId, usersTable.id)
      )
    );

  return user;
}

export async function linkUserWithOauth({
  userId,
  provider,
  providerAccountId,
}) {
  await db.insert(oauthAccountsTable).values({
    userId,
    provider,
    providerAccountId,
  });
}

export async function createUserWithOauth({
  name,
  email,
  provider,
  providerAccountId,
}) {
  const user = await db.transaction(async (trx) => {
    const [user] = await trx
      .insert(usersTable)
      .values({
        email,
        name,
        password: null, // we can't know password with oauth
        isEmailValid: true, // we know that google's email are valid
      })
      .$returningId();

    await trx.insert(oauthAccountsTable).values({
      provider,
      providerAccountId,
      userId: user.id,
    });

    return {
      id: user.id,
      name,
      email,
      isEmailValid: true,
      provider,
      providerAccountId,
    };
  });

  return user;
}
