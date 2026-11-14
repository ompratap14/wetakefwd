import Link from "next/link";
import { ForwardArrow } from "@/components/forward-arrow";

export function EmptyState({ compact = false, category }: { compact?: boolean; category?: string }) {
  if (compact) return <div className="empty-compact"><span className="empty-signal" aria-hidden="true">01</span><p>No published stories in {category || "this section"} yet.</p></div>;
  return <div className="empty-state"><div className="empty-art" aria-hidden="true"><span>INSIGHTS · EDITORIAL</span><b>Ideas<br/>in motion</b><ForwardArrow className="empty-arrow" /></div><div><span className="eyebrow">THE NEWSROOM IS TAKING SHAPE</span><h3>Good stories take thoughtful work.</h3><p>Our first pieces are in development. Explore the topics we cover, and subscribe to hear when the publication opens.</p><Link href="/#topics" className="arrow-link">Explore topics →</Link></div></div>;
}
