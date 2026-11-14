import Link from "next/link";
import { PARENT_URL } from "@/lib/site";

export function SiteFooter({ logoUrl }: { logoUrl?: string | null }) {
  void logoUrl;
  return <footer className="site-footer"><div className="page-width footer-simple">
    <div><Link href="/" className="footer-wordmark">Insights</Link><span>by <b>wetakefwd</b></span></div>
    <nav aria-label="Footer"><Link href="/about">About</Link><Link href="/write-for-us">Write for us</Link><Link href="/#newsletter">Newsletter</Link><a href={PARENT_URL} target="_blank" rel="noopener noreferrer">wetakefwd.online →</a></nav>
    <small>© {new Date().getFullYear()} Insights by WeTakeFwd.</small>
  </div></footer>;
}
