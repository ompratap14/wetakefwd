import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { EmptyState } from "@/components/empty-state";
import { NewsletterForm } from "@/components/newsletter-form";
import { categoryDefinitions, TAGLINE } from "@/lib/site";
import { categoryRecord, featuredArticle, latestArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

const editorialSections = [
  { title: "Artificial Intelligence", slug: "artificial-intelligence", label: "UNDERSTAND THE INTELLIGENCE" },
  { title: "Technology", slug: "technology", label: "THE DIGITAL WORLD" },
  { title: "Innovation Spotlight", slug: "innovation", label: "IDEAS WORTH WATCHING" },
  { title: "Future Technology", slug: "future-tech", label: "WHAT COMES NEXT" },
  { title: "Startups & Business", slug: "startups", label: "BUILDERS AND BUSINESS" },
  { title: "Research & Analysis", slug: "research", label: "THE DEEPER VIEW" },
];

export default async function HomePage() {
  const [featured, latest, sections] = await Promise.all([
    featuredArticle(), latestArticles(6),
    Promise.all(editorialSections.map(async (section) => {
      const category = await categoryRecord(section.slug);
      return { ...section, articles: category?.id ? await latestArticles(2, 0, category.id) : [] };
    })),
  ]);
  const editorsPicks = latest.filter((item) => item.isFeatured).slice(0, 3);
  return <>
    <section className="editorial-hero"><div className="page-width hero-inner"><div className="hero-copy"><span className="eyebrow">INSIGHTS BY WETAKEFWD / {TAGLINE}</span><h1>The Future Doesn&apos;t Wait. <em>Neither Should We.</em></h1><p>Discover the ideas, technologies and innovations shaping tomorrow.</p><div className="hero-bottom"><Link className="text-arrow" href="#featured">Explore the stories <span>↗</span></Link><span>Independent perspective. Better questions.</span></div></div><div className="hero-visual" aria-hidden="true"><div className="visual-circle"></div><span className="visual-index">ISSUE 001 / THE DIGITAL FUTURE</span><div className="visual-word">LOOK<br/><span>AHEAD.</span></div><div className="visual-signal">✳</div><div className="visual-footer"><span>EXPLORE</span><span>UNDERSTAND</span><span>INNOVATE</span></div></div></div></section>
    <div className="topic-ticker"><div className="page-width"><span>Technology with context</span><span>Artificial intelligence</span><span>Research and analysis</span><span>Ideas shaping tomorrow</span></div></div>
    <section className="section-space featured-section" id="featured"><div className="page-width"><div className="section-rule"><h2>Featured stories</h2><span className="eyebrow">01 / THE LEAD</span></div>{featured ? <div className="featured-layout"><ArticleCard article={featured} large /><div className="featured-aside">{latest.filter((item) => item.id !== featured.id).slice(0, 2).map((article) => <ArticleCard article={article} key={article.id} />)}</div></div> : <div className="feature-empty"><EmptyState /></div>}</div></section>
    <section className="section-space latest-section"><div className="page-width"><div className="section-rule"><h2>Latest articles</h2><Link href="/search">Browse the archive ↗</Link></div>{latest.length ? <div className="latest-list">{latest.map((article) => <ArticleCard article={article} key={article.id} />)}</div> : <EmptyState compact category="the latest desk" />}</div></section>
    <section className="section-space topics-section" id="topics"><div className="page-width"><div className="topics-heading"><div><span className="eyebrow">EIGHT LENSES / ONE CURIOUS WORLD</span><h2>Follow the<br/>important questions.</h2></div><p>Move between the technology itself, the people building it, and the wider effect it has on business and society.</p></div><div className="topics-grid">{categoryDefinitions.map((category, index) => <Link href={`/${category.slug}`} className="topic-card" key={category.slug}><span>{String(index + 1).padStart(2, "0")} / TOPIC</span><div><h3>{category.name}</h3><p>{category.description}</p></div><b>↗</b></Link>)}</div></div></section>
    <section className="section-space topic-columns-section"><div className="page-width"><div className="section-kicker">THE SUBJECTS WE FOLLOW</div><h2 className="section-title">From signal to <em>understanding.</em></h2><div className="topic-columns">{sections.map((section) => <div className="topic-column" key={section.slug}><div className="topic-column-head"><h3>{section.title}</h3><Link href={`/${section.slug}`} aria-label={`View ${section.title}`}>↗</Link></div><p>{section.label}</p>{section.articles.length ? section.articles.map((article) => <ArticleCard article={article} key={article.id} />) : <EmptyState compact category={section.title} />}</div>)}</div></div></section>
    <section className="section-space editors-section"><div className="page-width editors-inner"><div><span className="section-kicker">CHOSEN WITH CARE</span><h2>Editor&apos;s<br/><em>picks.</em></h2></div><div>{editorsPicks.length ? editorsPicks.map((article) => <ArticleCard article={article} key={article.id} />) : <EmptyState compact category="the editor's picks" />}</div></div></section>
    <section className="newsletter-section" id="newsletter"><div className="page-width newsletter-inner"><div><span className="eyebrow">THE INSIGHTS LETTER</span><h2>Stay curious.<br/><em>Stay ahead.</em></h2><p>A considered update on technology, innovation and the developments worth understanding.</p></div><NewsletterForm /></div></section>
  </>;
}
