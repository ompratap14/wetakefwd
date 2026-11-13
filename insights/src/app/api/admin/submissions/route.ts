import { z } from "zod";
import { requireDb } from "@/lib/db";
import { apiError, authorizeWrite } from "@/lib/security";
export async function POST(request: Request) { try { await authorizeWrite(request); const parsed = z.object({ id: z.string(), status: z.enum(["PENDING", "REVIEWED", "DECLINED"]) }).safeParse(await request.json()); if (!parsed.success) return Response.json({ message: "Invalid status." }, { status: 400 }); await requireDb().contributorSubmission.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status, reviewedAt: new Date() } }); return Response.json({ ok: true }); } catch (error) { return apiError(error); } }
