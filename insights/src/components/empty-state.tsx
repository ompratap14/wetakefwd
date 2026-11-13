import Link from "next/link";

export function EmptyState({ compact = false, category }: { compact?: boolean; category?: string }) {
  if (compact) return <div className="empty-compact"><span className="empty-signal">✳</span><p>No published stories in {category || "this section"} yet.</p></div>;
  return <div className="empty-state"><div className="empty-art" aria-hidden="true"><span>01</span><i></i><b>IDEAS<br/>IN MOTION</b></div><div><span className="eyebrow">THE NEWSROOM IS TAKING SHAPE</span><h3>Good stories take<br/><em>thoughtful work.</em></h3><p>Our first pieces are in development. Explore the topics we cover, and subscribe to hear when the publication opens.</p><Link href="/#topics" className="text-arrow">Explore topics <span>↗</span></Link></div></div>;
}
