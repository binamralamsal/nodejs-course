import { Google } from "arctic";
import { env } from "../../config/env.js";

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.FRONTEND_URL}/auth/google/callback` // We will create this route to verify after login
);
