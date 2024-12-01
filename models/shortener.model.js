import mongoose from "mongoose";

const shortLinksSchema = mongoose.Schema(
  {
    url: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const ShortLink = mongoose.model("ShortLink", shortLinksSchema);
