import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { CategoryTag } from "@/components/category-tag";
import { CoverImage } from "@/components/cover-image";
import { NewsletterSection } from "@/components/newsletter-section";
import { ReadingProgress } from "@/components/reading-progress";
import { ArticleContent, plainText } from "@/lib/article-content";
import { articleBySlug, latestArticles } from "@/lib/queries";
import { absoluteUrl, formatDate, safeExternalUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await articleBySlug((await params).slug);
  if (!article) return {};
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.summary;
  const canonical = safeExternalUrl(article.canonicalOverride) || absoluteUrl(`/article/${article.slug}`);
  return { title, description, alternates: { canonical }, openGraph: { type: "article", title, description, url: canonical, publishedTime: article.publishedAt?.toISOString(), authors: [article.author.name], images: article.coverImageUrl ? [{ url: article.coverImageUrl, alt: article.coverImageAlt || title }] : [] }, twitter: { card: "summary_large_image", title, description } };
}

export default async function ArticlePage({ params }: Props) {
  const article = await articleBySlug((await params).slug);
  if (!article) notFound();
  const related = (await latestArticles(4, 0, article.categoryId)).filter((item) => item.id !== article.id).slice(0, 3);
  const canonical = absoluteUrl(`/article/${article.slug}`);
  const readingTime = Math.max(1, Math.ceil(plainText(article.body).split(/\s+/).length / 220));
  const isEditorialTeam = article.author.slug === "wetakefwd-editorial-team";
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.summary, datePublished: article.publishedAt?.toISOString(), dateModified: article.updatedAt.toISOString(), author: { "@type": "Person", name: article.author.name, url: absoluteUrl(`/author/${article.author.slug}`) }, publisher: { "@type": "Organization", name: "Insights by WeTakeFwd", url: absoluteUrl("") }, mainEntityOfPage: canonical, image: article.coverImageUrl || undefined };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("") }, { "@type": "ListItem", position: 2, name: article.category.name, item: absoluteUrl(`/${article.category.slug}`) }, { "@type": "ListItem", position: 3, name: article.title, item: canonical }] };

  return <>
    <ReadingProgress />
    <article>
      <header className="article-head"><div className="article-head-inner">
        <CategoryTag name={article.category.name} slug={article.category.slug} />
        <h1>{article.title}</h1>
        <p className="article-dek">{article.subtitle || article.summary}</p>
        <div className="article-byline"><span className={`author-avatar${isEditorialTeam ? " brand-author-avatar" : ""}`}>{isEditorialTeam ? <Image src="/images/wetakefwd-mark.png" width={44} height={44} alt="WeTakeFwd" /> : article.author.photoUrl ? <Image src={article.author.photoUrl} width={44} height={44} alt="" /> : article.author.name.slice(0, 1).toUpperCase()}</span><div><Link href={`/author/${article.author.slug}`}>{article.author.name}</Link><span>{formatDate(article.publishedAt)} · {readingTime} min read</span></div></div>
      </div></header>

      <figure className="article-cover"><CoverImage article={article} priority linked={false} sizes="(max-width: 1100px) 100vw, 1100px" />{article.coverImageAlt && <figcaption>{article.coverImageAlt}</figcaption>}</figure>

      <div className="article-body-shell"><div className="key-takeaways"><strong>KEY TAKEAWAYS</strong><p>{article.summary}</p></div><ArticleContent body={article.body} />
        {Array.isArray(article.sources) && article.sources.length > 0 && <div className="article-end"><h3>Sources &amp; further reading</h3><ol>{article.sources.filter((source): source is { title: string; url: string } => typeof source === "object" && source !== null && "title" in source && "url" in source).map((source) => <li key={source.url}><a href={safeExternalUrl(source.url) || "#"} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ol></div>}
        <div className="author-bio"><span className={`author-avatar${isEditorialTeam ? " brand-author-avatar" : ""}`}>{isEditorialTeam ? <Image src="/images/wetakefwd-mark.png" width={44} height={44} alt="WeTakeFwd" /> : article.author.photoUrl ? <Image src={article.author.photoUrl} width={44} height={44} alt="" /> : article.author.name.slice(0, 1).toUpperCase()}</span><div><h3>About {article.author.name}</h3><p>{article.author.bio}</p><Link href={`/author/${article.author.slug}`}>More from this author →</Link></div></div>
        <NewsletterSection compact />
      </div>
    </article>

    {related.length > 0 && <section className="publication-section related-section"><div className="page-width"><div className="editorial-heading"><h2>Keep reading</h2><Link href={`/${article.category.slug}`}>More in {article.category.name} →</Link></div><div className="article-grid">{related.map((item) => <ArticleCard article={item} key={item.id} />)}</div></div></section>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, breadcrumbSchema]).replace(/</g, "\\u003c") }} />
  </>;
}
