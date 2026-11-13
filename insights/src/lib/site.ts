export const SITE_URL = (process.env.SITE_URL || "https://insights.wetakefwd.online").replace(/\/$/, "");
export const PARENT_URL = "https://wetakefwd.online";
export const PUBLICATION_NAME = "Insights by WeTakeFwd";
export const TAGLINE = "Explore. Understand. Innovate.";

export const categoryDefinitions = [
  { slug: "technology", name: "Technology", description: "The systems, products and ideas changing how we live and work." },
  { slug: "artificial-intelligence", name: "Artificial Intelligence", description: "A clear-eyed look at AI research, products, policy and practical use." },
  { slug: "innovation", name: "Innovation", description: "New approaches and breakthroughs with the potential to change what comes next." },
  { slug: "future-tech", name: "Future Tech", description: "Emerging technologies moving from experiment toward everyday life." },
  { slug: "startups", name: "Startups", description: "The people and companies building new answers to important problems." },
  { slug: "business-technology", name: "Business & Technology", description: "How technology reshapes organisations, markets and the work behind them." },
  { slug: "research", name: "Research & Analysis", description: "Evidence, context and deeper analysis behind the headlines." },
  { slug: "opinions", name: "Opinions", description: "Considered perspectives on technology and its impact." },
] as const;

export const primaryNav = categoryDefinitions.slice(0, 5);

export function categoryBySlug(slug: string) {
  return categoryDefinitions.find((item) => item.slug === slug);
}

export function slugify(value: string) {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function safeExternalUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.toString() : null;
  } catch { return null; }
}
