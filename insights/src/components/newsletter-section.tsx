import { NewsletterForm } from "@/components/newsletter-form";

export function NewsletterSection({ compact = false }: { compact?: boolean }) {
  return <section className={compact ? "article-newsletter-card" : "newsletter-section"} id={compact ? undefined : "newsletter"}><div className={compact ? "" : "page-width newsletter-inner"}>
    <div><span className="newsletter-label">THE SUNDAY BRIEF</span><h2>{compact ? "Enjoyed this? Get the Sunday Brief." : <>The week in tech &amp; AI,<br/>in five minutes.</>}</h2><p>A clear, considered briefing on the developments worth understanding.</p></div>
    <NewsletterForm />
  </div></section>;
}
