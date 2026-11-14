"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { categoryDefinitions, PARENT_URL } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();
  void logoUrl;
  if (pathname.startsWith("/article/")) return <header className="compact-header"><div className="page-width">
    <Link href="/" className="compact-wordmark">Insights <span>by wetakefwd</span></Link>
    <div className="compact-actions"><ThemeToggle /><Link className="subscribe-pill" href="/#newsletter">Subscribe →</Link></div>
  </div></header>;
  return <>
    <header className="site-header masthead">
      <div className="masthead-strip"><div className="page-width"><span>Technology, AI &amp; innovation — explained clearly</span><a href={PARENT_URL} target="_blank" rel="noopener noreferrer">A publication by wetakefwd</a></div></div>
      <div className="page-width masthead-main">
        <Link className="masthead-logo" href="/" aria-label="Insights by WeTakeFwd home"><strong>Insights</strong><span>by <b>wetakefwd</b></span></Link>
        <div className="masthead-actions"><ThemeToggle /><Link className="search-button" href="/search" aria-label="Search"><Search size={18} strokeWidth={1.6} /></Link><Link className="subscribe-pill" href="/#newsletter">Subscribe</Link></div>
      </div>
      <nav className="category-nav page-width" aria-label="Primary navigation">{categoryDefinitions.map((item) => <Link className={pathname === `/${item.slug}` ? "current" : ""} href={`/${item.slug}`} key={item.slug}>{item.name}</Link>)}</nav>
    </header>
  </>;
}
