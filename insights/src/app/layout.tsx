import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PUBLICATION_NAME, SITE_URL, TAGLINE } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap" });

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Insights by WeTakeFwd | Technology & Innovation", template: "%s | Insights by WeTakeFwd" },
  description: "Explore technology, artificial intelligence, innovation and the ideas shaping the digital future.",
  applicationName: PUBLICATION_NAME,
  openGraph: { type: "website", siteName: PUBLICATION_NAME, title: PUBLICATION_NAME, description: TAGLINE, url: SITE_URL },
  twitter: { card: "summary_large_image", title: PUBLICATION_NAME, description: TAGLINE },
  robots: { index: true, follow: true },
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { ...baseMetadata, title: { default: settings?.seoDefaultTitle || "Insights by WeTakeFwd | Technology & Innovation", template: `%s | ${settings?.publicationName || PUBLICATION_NAME}` }, description: settings?.seoDefaultDescription || baseMetadata.description, openGraph: { type: "website", siteName: settings?.publicationName || PUBLICATION_NAME, title: settings?.seoDefaultTitle || PUBLICATION_NAME, description: settings?.seoDefaultDescription || TAGLINE, url: SITE_URL } };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: PUBLICATION_NAME, url: SITE_URL, parentOrganization: { "@type": "Organization", name: "WeTakeFwd", url: "https://wetakefwd.online" } };
  return <html lang="en"><body className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader logoUrl={settings?.logoUrl} /><main id="main-content">{children}</main><SiteFooter logoUrl={settings?.logoUrl} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} /></body></html>;
}
