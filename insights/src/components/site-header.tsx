"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { primaryNav, PARENT_URL } from "@/lib/site";

export function SiteHeader({ logoUrl }: { logoUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <>
    <div className="ownership-strip"><div className="page-width">A publication by <a href={PARENT_URL} target="_blank" rel="noopener noreferrer">WeTakeFwd ↗</a><span>Explore. Understand. Innovate.</span></div></div>
    <header className="site-header">
      <div className="page-width header-main">
        <Link className="wordmark" href="/" aria-label="Insights by WeTakeFwd home" onClick={() => setOpen(false)}>{logoUrl ? <Image unoptimized className="publication-logo" src={logoUrl} alt="Insights by WeTakeFwd" width={215} height={52} /> : <><span>INSIGHTS<span className="wordmark-dot">.</span></span><small>BY WETAKEFWD</small></>}</Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link className={pathname === "/" ? "current" : ""} href="/">Home</Link>
          {primaryNav.map((item) => <Link className={pathname === `/${item.slug}` ? "current" : ""} href={`/${item.slug}`} key={item.slug}>{item.name === "Artificial Intelligence" ? "AI" : item.name}</Link>)}
          <Link className={pathname === "/research" ? "current" : ""} href="/research">Research</Link>
        </nav>
        <div className="header-actions"><Link className="search-link" href="/search" aria-label="Search articles"><Search size={19} strokeWidth={1.8} /><span>Search</span></Link><Link className="subscribe-link" href="/#newsletter">Subscribe <span>↗</span></Link><button className="mobile-menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button></div>
      </div>
      {open && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation"><div className="page-width"><Link href="/" onClick={() => setOpen(false)}>Home</Link>{primaryNav.map((item) => <Link href={`/${item.slug}`} key={item.slug} onClick={() => setOpen(false)}>{item.name}</Link>)}<Link href="/research" onClick={() => setOpen(false)}>Research &amp; Analysis</Link><Link href="/business-technology" onClick={() => setOpen(false)}>Business &amp; Technology</Link><Link href="/opinions" onClick={() => setOpen(false)}>Opinions</Link><Link href="/search" onClick={() => setOpen(false)}>Search articles</Link><Link className="mobile-subscribe" href="/#newsletter" onClick={() => setOpen(false)}>Subscribe ↗</Link></div></nav>}
    </header>
  </>;
}
