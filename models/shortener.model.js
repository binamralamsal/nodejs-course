import path from "path";
import fs from "fs/promises";

const DATA_FILE = path.join("data", "links.json");

export async function loadLinks() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
}

export async function saveLinks(links) {
  await fs.writeFile(DATA_FILE, JSON.stringify(links));
}
