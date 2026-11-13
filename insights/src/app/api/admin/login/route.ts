import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { requireDb } from "@/lib/db";
import { apiError, enforceOrigin, hashToken, newToken, rateLimit, sessionCookie } from "@/lib/security";

export async function POST(request: Request) {
  try {
    await enforceOrigin(request);
    await rateLimit("admin-login", 8, 15);
    const isJson = request.headers.get("content-type")?.includes("application/json");
    const input = isJson ? await request.json() : Object.fromEntries(await request.formData());
    const parsed = z.object({ email: z.email(), password: z.string().min(1) }).safeParse(input);
    if (!parsed.success) return Response.json({ message: "Enter a valid email and password." }, { status: 400 });
    const user = await requireDb().user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (!user || !(await compare(parsed.data.password, user.passwordHash))) return Response.json({ message: "Incorrect email or password." }, { status: 401 });
    const token = newToken();
    await requireDb().adminSession.create({ data: { userId: user.id, tokenHash: hashToken(token), csrfToken: newToken(), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60_000) } });
    (await cookies()).set(sessionCookie, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60 });
    return isJson ? Response.json({ ok: true }) : Response.redirect(new URL("/admin", request.url), 303);
  } catch (error) { return apiError(error); }
}
