import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalDb = globalThis as unknown as { insightsPrisma?: PrismaClient };

export function getDb(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!globalDb.insightsPrisma) {
    const adapter = new PrismaPg({ connectionString });
    globalDb.insightsPrisma = new PrismaClient({ adapter });
  }
  return globalDb.insightsPrisma;
}

export function requireDb(): PrismaClient {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");
  return db;
}
