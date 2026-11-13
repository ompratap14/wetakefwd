import Link from "next/link";
import { getDb } from "@/lib/db";
import { hashToken, newToken } from "@/lib/security";
import { absoluteUrl } from "@/lib/site";
export const dynamic = "force-dynamic";
export const metadata = { title: "Confirm subscription", robots: { index: false, follow: false } };
export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token || "";
  const subscriber = token && getDb() ? await getDb()!.newsletterSubscriber.findUnique({ where: { confirmationTokenHash: hashToken(token) } }) : null;
  const valid = subscriber?.status === "PENDING" && !!subscriber.confirmationExpiresAt && subscriber.confirmationExpiresAt > new Date();
  if (valid) {
    const unsubscribe = newToken();
    await getDb()!.newsletterSubscriber.update({ where: { id: subscriber.id }, data: { status: "ACTIVE", confirmedAt: new Date(), confirmationTokenHash: null, confirmationExpiresAt: null, unsubscribeTokenHash: hashToken(unsubscribe) } });
    if (process.env.RESEND_API_KEY && process.env.NEWSLETTER_FROM_EMAIL) {
      const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.NEWSLETTER_FROM_EMAIL, to: [subscriber.email], subject: "Welcome to Insights by WeTakeFwd", html: `<p>Your Insights subscription is confirmed. We’ll write when there is something worth understanding.</p><p><a href="${absoluteUrl(`/newsletter/unsubscribe?token=${unsubscribe}`)}">Unsubscribe</a></p>` }) });
      if (!response.ok) console.error("Newsletter welcome email failed", response.status);
    }
  }
  return <section className="success-panel"><div className="page-width"><span className="eyebrow">INSIGHTS LETTER</span><h1>{valid ? "You’re on the list." : "This link has expired."}</h1><p>{valid ? "Your subscription is confirmed. We’ll send you thoughtful updates when there is something worth sharing." : "Please subscribe again to request a new confirmation link."}</p><Link className="text-arrow" href="/">Explore Insights ↗</Link></div></section>;
}
