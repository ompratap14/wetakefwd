import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";
const url = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase().trim();
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
if (!url || !email || !password || password.length < 16) throw new Error("Set a database URL, BOOTSTRAP_ADMIN_EMAIL, and a password of at least 16 characters.");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
try { const existing = await db.user.count({ where: { role: "ADMIN" } }); if (existing) throw new Error("An admin already exists. Bootstrap cannot overwrite it."); await db.user.create({ data: { email, passwordHash: await hash(password, 12), role: "ADMIN" } }); console.log(`Created admin ${email}. Remove the bootstrap password from environment variables now.`); } finally { await db.$disconnect(); }
