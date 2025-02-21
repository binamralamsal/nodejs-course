import { z } from "zod";

export const env = z
  .object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    FRONTEND_URL: z.string().min(1),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
  })
  .parse(process.env);
