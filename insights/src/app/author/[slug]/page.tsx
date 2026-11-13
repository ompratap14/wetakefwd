import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { authorArticles, authorBySlug } from "@/lib/queries";
import { getDb } from "@/lib/db";
import { absoluteUrl, safeExternalUrl } from "@/lib/site";
import Image from "next/image";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const author = await authorBySlug((await params).slug); return author ? { title: author.name, description: author.bio, alternates: { canonical: absoluteUrl(`/author/${author.slug}`) } } : {}; }
export default async function AuthorPage({ params, searchParams }: Props) {
  const author = await authorBySlug((await params).slug); if (!author) notFound();
  const page = Math.max(1, Number.parseInt((await searchParams).page || "1", 10) || 1);
  const [articles, count] = await Promise.all([authorArticles(author.id, 12, (page - 1) * 12), getDb()?.article.count({ where: { authorId: author.id, status: "PUBLISHED", publishedAt: { lte: new Date() } } }) ?? 0]);
  return <><section className="page-hero"><div className="page-width"><nav className="breadcrumb"><Link href="/">Home</Link><span>/</span>Author</nav><span className="eyebrow">THE PEOPLE BEHIND THE STORIES</span>{author.photoUrl && <div className="author-profile-photo"><Image src={author.photoUrl} alt={author.name} width={130} height={130} /></div>}<h1>{author.name}<em>.</em></h1><p>{author.bio}</p><div className="author-links">{author.expertise.map((item) => <span key={item}>{item}</span>)}{[["LinkedIn", author.linkedinUrl], ["X", author.xUrl], ["Website", author.websiteUrl]].map(([label,url]) => safeExternalUrl(url) && <a key={label} href={safeExternalUrl(url)!} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}</div></div></section><section className="section-space"><div className="page-width"><div className="section-rule"><h2>Stories by {author.name}</h2><span>{count} published</span></div>{articles.length ? <div className="article-grid">{articles.map((article) => <ArticleCard article={article} key={article.id} />)}</div> : <EmptyState compact category="this author" />}<Pagination page={page} total={count} basePath={`/author/${author.slug}`} /></div></section></>;
}
