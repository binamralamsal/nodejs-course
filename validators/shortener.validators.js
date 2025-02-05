import { z } from "zod";

export const newShortLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .url({ message: "Please enter a valid URL." })
    .max(1024, { message: "URL cannot be longer than 1024 characters." }),

  shortCode: z
    .string()
    .min(3, { message: "Short code must be at least 3 characters long." })
    .max(50, { message: "Short code cannot be longer than 50 characters." })
    .optional(),
});
