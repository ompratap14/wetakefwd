import { z } from "zod";
import { requireDb } from "@/lib/db";
import { apiError, enforceOrigin, rateLimit } from "@/lib/security";
const schema = z.object({ name: z.string().min(2).max(100), email: z.email().max(254), background: z.string().min(20).max(2000), title: z.string().min(10).max(180), summary: z.string().min(30).max(2000), draft: z.string().min(100).max(30000), references: z.array(z.url()).max(20), consent: z.literal(true) });
export async function POST(request: Request) {
  try {
    await enforceOrigin(request); await rateLimit("submissions", 3, 24 * 60);
    const form = await request.formData();
    if (form.get("website")) return Response.json({ message: "Thank you. Your pitch has been submitted." });
    const result = schema.safeParse({ name: form.get("name"), email: form.get("email"), background: form.get("background"), title: form.get("title"), summary: form.get("summary"), draft: form.get("draft"), references: String(form.get("references") || "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean), consent: form.get("consent") === "on" });
    if (!result.success) return Response.json({ message: "Please check every field and use valid reference URLs." }, { status: 400 });
    await requireDb().contributorSubmission.create({ data: { ...result.data, email: result.data.email.toLowerCase() } });
    return Response.json({ message: "Thank you. Your pitch has been submitted. We’ll be in touch if it fits our editorial plans." });
  } catch (error) { return apiError(error); }
}
