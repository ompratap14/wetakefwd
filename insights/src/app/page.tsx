import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { CategoryTag } from "@/components/category-tag";
import { CoverImage } from "@/components/cover-image";
import { EmptyState } from "@/components/empty-state";
import { NewsletterSection } from "@/components/newsletter-section";
import { NumberedList } from "@/components/numbered-list";
import { categoryRecord, featuredArticle, latestArticles } from "@/lib/queries";
import { plainText } from "@/lib/article-content";

export const dynamic = "force-dynamic";

const editorialSections = [
  { title: "Artificial Intelligence", slug: "artificial-intelligence" },
  { title: "Technology", slug: "technology" },
  { title: "Innovation", slug: "innovation" },
  { title: "Future Tech", slug: "future-tech" },
  { title: "Startups", slug: "startups" },
  { title: "Research & Analysis", slug: "research" },
];

export default async function HomePage() {
  const [featured, latest, sections] = await Promise.all([
    featuredArticle(),
    latestArticles(6),
    Promise.all(editorialSections.map(async (section) => {
      const category = await categoryRecord(section.slug);
      return { ...section, articles: category?.id ? await latestArticles(4, 0, category.id) : [] };
    })),
  ]);
  const featuredReadingTime = featured ? Math.max(1, Math.ceil(plainText(featured.body).split(/\s+/).length / 220)) : 0;

  return <>
    <section className="home-featured"><div className="page-width">
      {featured ? <div className="home-featured-grid">
        <CoverImage article={featured} priority sizes="(max-width: 800px) 100vw, 58vw" />
        <div className="home-featured-copy"><CategoryTag name={featured.category.name} slug={featured.category.slug} suffix="Featured" /><h1><Link href={`/article/${featured.slug}`}>{featured.title}</Link></h1><p>{featured.summary}</p><div className="featured-meta">By <Link href={`/author/${featured.author.slug}`}>{featured.author.name}</Link> · {featuredReadingTime} min read</div></div>
      </div> : <EmptyState />}
    </div></section>

    <section className="publication-section latest-section"><div className="page-width">
      <div className="editorial-heading"><h2>Latest</h2><Link href="/search">See all →</Link></div>
      {latest.length ? <div className="article-grid">{latest.map((article) => <ArticleCard article={article} key={article.id} />)}</div> : <EmptyState compact category="the latest desk" />}
    </div></section>

    <section className="publication-section category-rows" id="topics"><div className="page-width">
      {sections.map((section) => <div className="category-row" key={section.slug}>
        <div className="editorial-heading"><h2><CategoryTag name={section.title} slug={section.slug} /></h2><Link href={`/${section.slug}`}>More in {section.title} →</Link></div>
        {section.articles.length ? <NumberedList articles={section.articles} /> : <EmptyState compact category={section.title} />}
      </div>)}
    </div></section>
    <NewsletterSection />
  </>;
}
