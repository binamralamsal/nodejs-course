import { prisma } from "../config/db.js";

export async function getAllShortLinks() {
  const allShortLinks = await prisma.shortLink.findMany();
  return allShortLinks;
}

export async function insertShortLink({ shortCode, url }) {
  const newShortLink = await prisma.shortLink.create({
    data: { shortCode, url },
  });
  return newShortLink;
}

export async function getShortLinkByShortCode(shortCode) {
  const shortLink = await prisma.shortLink.findUnique({
    where: { shortCode },
  });
  return shortLink;
}
