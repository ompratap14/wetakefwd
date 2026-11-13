import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { currentUser } from "@/lib/security";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };
export default async function DashboardLayout({ children }: { children: React.ReactNode }) { const user = await currentUser(); if (!user) redirect("/admin/login"); return <AdminShell csrf={user.csrfToken} role={user.role}>{children}</AdminShell>; }
