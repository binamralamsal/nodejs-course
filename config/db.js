import { env } from "./env.js";
import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER, // Your MySQL username
  password: env.DATABASE_PASSWORD, // Your MySQL password
  database: env.DATABASE_NAME, // Your database name
});
