import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { apiError, currentUser, enforceCsrf, hashToken, sessionCookie } from "@/lib/security";
export async function POST(request: Request) {
  try {
    const user = await currentUser(); if (!user) return Response.json({ ok: true });
    await enforceCsrf(request, user.csrfToken);
    const token = (await cookies()).get(sessionCookie)?.value;
    if (token) await getDb()?.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } });
    (await cookies()).delete(sessionCookie);
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}
