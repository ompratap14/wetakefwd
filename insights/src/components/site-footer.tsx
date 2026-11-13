import Link from "next/link";
import Image from "next/image";
import { categoryDefinitions, PARENT_URL } from "@/lib/site";

export function SiteFooter({ logoUrl }: { logoUrl?: string | null }) {
  return <footer className="site-footer"><div className="page-width">
    <div className="footer-top"><div><Link href="/" className="footer-wordmark">{logoUrl ? <Image unoptimized className="footer-publication-logo" src={logoUrl} alt="Insights by WeTakeFwd" width={250} height={70} /> : <>INSIGHTS<span>.</span></>}</Link><p>Explore. Understand. Innovate.</p><small>A publication by <a href={PARENT_URL} target="_blank" rel="noopener noreferrer">WeTakeFwd ↗</a></small></div><div className="footer-columns"><div><strong>Explore</strong>{categoryDefinitions.slice(0,5).map((item) => <Link href={`/${item.slug}`} key={item.slug}>{item.name}</Link>)}</div><div><strong>Publication</strong><Link href="/about">About us</Link><Link href="/write-for-us">Write for us</Link><Link href="/editorial-policy">Editorial policy</Link><Link href="/contact">Contact</Link></div><div><strong>Legal</strong><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms of use</Link><Link href="/copyright">Copyright policy</Link></div></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Insights by WeTakeFwd. All rights reserved.</span><Link href="/rss.xml">RSS feed ↗</Link></div>
  </div></footer>;
}
