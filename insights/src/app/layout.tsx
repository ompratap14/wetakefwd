import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PUBLICATION_NAME, SITE_URL, TAGLINE } from "@/lib/site";
import { getDb } from "@/lib/db";
import "./globals.css";

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
  const settings = await getDb()?.siteSettings.findUnique({ where: { id: "primary" } });
  return { ...baseMetadata, title: { default: settings?.seoDefaultTitle || "Insights by WeTakeFwd | Technology & Innovation", template: `%s | ${settings?.publicationName || PUBLICATION_NAME}` }, description: settings?.seoDefaultDescription || baseMetadata.description, openGraph: { type: "website", siteName: settings?.publicationName || PUBLICATION_NAME, title: settings?.seoDefaultTitle || PUBLICATION_NAME, description: settings?.seoDefaultDescription || TAGLINE, url: SITE_URL } };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getDb()?.siteSettings.findUnique({ where: { id: "primary" } });
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: PUBLICATION_NAME, url: SITE_URL, parentOrganization: { "@type": "Organization", name: "WeTakeFwd", url: "https://wetakefwd.online" } };
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader logoUrl={settings?.logoUrl} /><main id="main-content">{children}</main><SiteFooter logoUrl={settings?.logoUrl} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} /></body></html>;
}
