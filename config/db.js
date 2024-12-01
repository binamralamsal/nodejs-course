import { env } from "./env.js";
import mongoose from "mongoose";

export async function connectDB() {
  if (env.NODE_ENV === "development") mongoose.set("debug", true);

  return await mongoose.connect(env.MONGODB_URI);
}
