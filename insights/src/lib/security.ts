import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { requireDb } from "@/lib/db";

export const sessionCookie = "insights_session";
export const hashToken = (value: string) => createHash("sha256").update(value).digest("hex");
export const newToken = () => randomBytes(32).toString("base64url");

export async function currentUser() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;
  const session = await requireDb().adminSession.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  return { ...session.user, csrfToken: session.csrfToken };
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function authorizeWrite(request: Request, adminOnly = false) {
  const user = await requireUser();
  if (adminOnly && user.role !== "ADMIN") throw new Error("UNAUTHORIZED");
  await enforceCsrf(request, user.csrfToken);
  return user;
}

export async function enforceOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) throw new Error("INVALID_ORIGIN");
}

export async function enforceCsrf(request: Request, token: string) {
  await enforceOrigin(request);
  if (request.headers.get("x-csrf-token") !== token) throw new Error("INVALID_CSRF");
}

export async function rateLimit(action: string, max: number, minutes = 60) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashToken(`${process.env.RATE_LIMIT_SECRET || "insights-rate-limit"}:${ip}`);
  const db = requireDb();
  const since = new Date(Date.now() - minutes * 60_000);
  const count = await db.rateLimitEvent.count({ where: { ipHash, action, createdAt: { gte: since } } });
  if (count >= max) throw new Error("RATE_LIMITED");
  await db.rateLimitEvent.create({ data: { ipHash, action } });
}

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN";
  const status = message === "UNAUTHORIZED" ? 401 : message === "RATE_LIMITED" ? 429 : ["INVALID_ORIGIN", "INVALID_CSRF"].includes(message) ? 403 : 500;
  return Response.json({ message: status === 500 ? "The request could not be completed." : message.replaceAll("_", " ").toLowerCase() }, { status });
}
