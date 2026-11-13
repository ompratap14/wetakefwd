import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin-login";
import { currentUser } from "@/lib/security";
export const dynamic = "force-dynamic";
export const metadata = { title: "Editorial sign in", robots: { index: false, follow: false } };
export default async function LoginPage() { if (await currentUser()) redirect("/admin"); return <section className="content-page"><div className="page-width reading-width"><span className="eyebrow">PRIVATE EDITORIAL AREA</span><h1>Welcome back<em>.</em></h1><p>Sign in to manage the publication.</p><AdminLogin /></div></section>; }
