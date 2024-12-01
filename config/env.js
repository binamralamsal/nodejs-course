import { z } from "zod";

export const env = z
  .object({
    PORT: z.coerce.number().default(3000),
    MONGODB_URI: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
  })
  .parse(process.env);
