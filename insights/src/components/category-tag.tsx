const categoryColors: Record<string, string> = {
  "artificial-intelligence": "#7C3AED",
  ai: "#7C3AED",
  automation: "#2563EB",
  startups: "#059669",
  tools: "#EA580C",
  product: "#DB2777",
  policy: "#111418",
};

export function CategoryTag({ name, slug, suffix }: { name: string; slug: string; suffix?: string }) {
  return <span className="category-tag"><i style={{ backgroundColor: categoryColors[slug] || "#0B1F4D" }} aria-hidden="true" />{name}{suffix ? ` · ${suffix}` : ""}</span>;
}
