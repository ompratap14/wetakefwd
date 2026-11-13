import Link from "next/link";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };
export default async function ContactPage() { const settings = await getDb()?.siteSettings.findUnique({ where: { id: "primary" } }); return <section className="content-page"><div className="page-width reading-width"><span className="eyebrow">GET IN TOUCH</span><h1>Talk to the <em>editors.</em></h1><p>For editorial feedback, corrections, partnership questions or press enquiries, contact the publication at {settings?.contactEmail ? <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a> : <a href="https://wetakefwd.online/#contact">WeTakeFwd’s contact page</a>}.</p><p>Want to pitch an article? Use our <Link href="/write-for-us">contributor form</Link> so the editors have everything they need to review it.</p></div></section>; }

