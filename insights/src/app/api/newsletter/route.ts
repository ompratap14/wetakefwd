import { z } from "zod";
import { requireDb } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";
import { apiError, enforceOrigin, hashToken, newToken, rateLimit } from "@/lib/security";

export async function POST(request: Request) {
  try {
    await enforceOrigin(request);
    await rateLimit("newsletter", 6);
    const form = await request.formData();
    if (form.get("website")) return Response.json({ message: "Check your inbox to confirm your subscription." });
    const email = z.email().max(254).safeParse(form.get("email"));
    if (!email.success) return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
    if (!process.env.RESEND_API_KEY || !process.env.NEWSLETTER_FROM_EMAIL) return Response.json({ message: "Subscriptions are temporarily unavailable. Please try again later." }, { status: 503 });
    const normalized = email.data.toLowerCase().trim();
    const existing = await requireDb().newsletterSubscriber.findUnique({ where: { email: normalized } });
    if (existing?.status === "ACTIVE") return Response.json({ message: "Check your inbox to confirm your subscription." });
    const confirmation = newToken();
    const unsubscribe = newToken();
    await requireDb().newsletterSubscriber.upsert({ where: { email: normalized }, create: { email: normalized, confirmationTokenHash: hashToken(confirmation), confirmationExpiresAt: new Date(Date.now() + 24 * 60 * 60_000), unsubscribeTokenHash: hashToken(unsubscribe) }, update: { status: "PENDING", confirmationTokenHash: hashToken(confirmation), confirmationExpiresAt: new Date(Date.now() + 24 * 60 * 60_000), unsubscribeTokenHash: hashToken(unsubscribe) } });
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.NEWSLETTER_FROM_EMAIL, to: [normalized], subject: "Confirm your Insights subscription", html: `<p>Thanks for your interest in Insights by WeTakeFwd.</p><p><a href="${absoluteUrl(`/newsletter/confirm?token=${confirmation}`)}">Confirm my subscription</a></p><p>If you did not request this, ignore this email.</p>` }) });
    if (!response.ok) { console.error("Newsletter confirmation email failed", response.status); return Response.json({ message: "We could not send your confirmation email. Please try again." }, { status: 502 }); }
    return Response.json({ message: "Check your inbox to confirm your subscription." });
  } catch (error) { return apiError(error); }
}
