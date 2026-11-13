import Link from "next/link";
import { getDb } from "@/lib/db";
import { hashToken } from "@/lib/security";
export const dynamic = "force-dynamic";
export const metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token || "";
  const subscriber = token && getDb() ? await getDb()!.newsletterSubscriber.findUnique({ where: { unsubscribeTokenHash: hashToken(token) } }) : null;
  if (subscriber) await getDb()!.newsletterSubscriber.update({ where: { id: subscriber.id }, data: { status: "UNSUBSCRIBED", confirmationTokenHash: null } });
  return <section className="success-panel"><div className="page-width"><h1>{subscriber ? "You’re unsubscribed." : "This link is invalid."}</h1><p>{subscriber ? "You will no longer receive the Insights letter." : "Please use the unsubscribe link in your email."}</p><Link className="text-arrow" href="/">Return home ↗</Link></div></section>;
}
