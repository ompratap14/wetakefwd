import { z } from "zod";
import { requireDb } from "@/lib/db";
import { apiError, authorizeWrite } from "@/lib/security";
const schema = z.object({ id: z.string().optional(), slug: z.string().min(2).max(100), name: z.string().min(2).max(100), description: z.string().min(10).max(2000), seoTitle: z.string().nullable().optional(), seoDescription: z.string().nullable().optional() });
export async function POST(request: Request) { try { await authorizeWrite(request); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return Response.json({ message: "Check category details." }, { status: 400 }); const { id, ...data } = parsed.data; const record = id ? await requireDb().category.update({ where: { id }, data }) : await requireDb().category.create({ data }); return Response.json({ ok: true, id: record.id }); } catch (error) { return apiError(error); } }
export async function DELETE(request: Request) { try { await authorizeWrite(request, true); const { id } = await request.json(); await requireDb().category.delete({ where: { id } }); return Response.json({ ok: true }); } catch (error) { return apiError(error); } }
