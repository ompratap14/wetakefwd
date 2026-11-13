import { getDb } from "@/lib/db";

let warned = false;

export async function getSiteSettings() {
  const db = getDb();
  if (!db) return null;
  try {
    return await db.siteSettings.findUnique({ where: { id: "primary" } });
  } catch {
    // The first deployment can build before its database migration runs.
    if (!warned) {
      console.warn("Site settings unavailable; using publication defaults.");
      warned = true;
    }
    return null;
  }
}
