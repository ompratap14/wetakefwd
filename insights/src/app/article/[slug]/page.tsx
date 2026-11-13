import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent, headings } from "@/lib/article-content";
import { articleBySlug, latestArticles } from "@/lib/queries";
import { absoluteUrl, formatDate, safeExternalUrl } from "@/lib/site";
import { ArticleCard } from "@/components/article-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { plainText } from "@/lib/article-content";

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
  const toc = headings(article.body);
  const canonical = absoluteUrl(`/article/${article.slug}`);
  const readingTime = Math.max(1, Math.ceil(plainText(article.body).split(/\s+/).length / 220));
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.summary, datePublished: article.publishedAt?.toISOString(), dateModified: article.updatedAt.toISOString(), author: { "@type": "Person", name: article.author.name, url: absoluteUrl(`/author/${article.author.slug}`) }, publisher: { "@type": "Organization", name: "Insights by WeTakeFwd", url: absoluteUrl("") }, mainEntityOfPage: canonical, image: article.coverImageUrl || undefined };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("") }, { "@type": "ListItem", position: 2, name: article.category.name, item: absoluteUrl(`/${article.category.slug}`) }, { "@type": "ListItem", position: 3, name: article.title, item: canonical }] };
  return <><section className="article-head"><div className="page-width article-head-inner"><nav className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={`/${article.category.slug}`}>{article.category.name}</Link></nav><span className="eyebrow">{article.category.name} / {formatDate(article.publishedAt)} / {readingTime} min read</span><h1>{article.title}</h1>{article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}<p className="article-subtitle">{article.summary}</p><div className="article-byline"><span className="author-avatar">{article.author.photoUrl ? <Image src={article.author.photoUrl} width={45} height={45} alt="" /> : article.author.name.slice(0, 1)}</span><div><Link href={`/author/${article.author.slug}`}>{article.author.name}</Link><br/><span>Published {formatDate(article.publishedAt)} · Updated {formatDate(article.updatedAt)}</span></div></div></div></section>{article.coverImageUrl && <div className="page-width article-hero-image"><Image src={article.coverImageUrl} alt={article.coverImageAlt || article.title} fill sizes="100vw" priority /></div>}<div className="page-width article-layout"><aside className="article-toc"><strong>In this article</strong>{toc.map((item) => <a href={`#${item.id}`} key={item.id}>{item.text}</a>)}</aside><div><ArticleContent body={article.body} />{Array.isArray(article.sources) && article.sources.length > 0 && <div className="article-end"><h3>Sources & further reading</h3><ol>{article.sources.filter((source): source is { title: string; url: string } => typeof source === "object" && source !== null && "title" in source && "url" in source).map((source) => <li key={source.url}><a href={safeExternalUrl(source.url) || "#"} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ol></div>}<div className="author-bio"><span className="author-avatar">{article.author.name.slice(0,1)}</span><div><h3>About {article.author.name}</h3><p>{article.author.bio}</p><Link href={`/author/${article.author.slug}`}>More from this author ↗</Link></div></div><div className="article-newsletter"><h3>Stay curious.</h3><NewsletterForm /></div></div><aside className="article-share"><strong>Share this story</strong><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer">X ↗</a></aside></div><section className="section-space related-section"><div className="page-width"><div className="section-rule"><h2>Keep exploring</h2><Link href={`/${article.category.slug}`}>More in {article.category.name} ↗</Link></div><div className="article-grid">{related.map((item) => <ArticleCard article={item} key={item.id} />)}</div></div></section><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema,breadcrumbSchema]).replace(/</g, "\\u003c") }} /></>;
}
