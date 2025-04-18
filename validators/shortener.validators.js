import { z } from "zod";

export const urlSchema = z
  .string({ required_error: "URL is required." })
  .trim()
  .url({ message: "Please enter a valid URL." })
  .max(1024, { message: "URL cannot be longer than 1024 characters." });

export const shortCodeSchema = z
  .string({ required_error: "Short code is required." })
  .trim()
  .min(3, { message: "Short code must be at least 3 characters long." })
  .max(50, { message: "Short code cannot be longer than 50 characters." });

export const shortLinkIdSchema = z.coerce.number().int().positive();

export const newShortLinkSchema = z.object({
  url: urlSchema,
  shortCode: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    shortCodeSchema.optional()
  ),
});

export const editShortLinkSchema = z.object({
  url: urlSchema,
  shortCode: shortCodeSchema,
});

export const shortenerSearchParamsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .min(1)
    .optional() // optional must come before default, otherwise default value won't be set.
    .default(1)
    .catch(1), // if validation error occurs, then it will choose 1. it is necessary, otherwise if validation fails then 500 will occur
});
