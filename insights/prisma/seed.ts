import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { categoryDefinitions } from "../src/lib/site";
const url = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!url) throw new Error("Set DIRECT_DATABASE_URL or DATABASE_URL");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
try { for (const category of categoryDefinitions) await db.category.upsert({ where: { slug: category.slug }, create: category, update: { name: category.name, description: category.description } }); await db.siteSettings.upsert({ where: { id: "primary" }, create: { id: "primary" }, update: {} }); console.log("Seeded categories and settings. No articles or authors were invented."); } finally { await db.$disconnect(); }
