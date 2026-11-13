import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { categoryDefinitions, absoluteUrl } from "@/lib/site";
import { categoryRecord, latestArticles, publishedCount } from "@/lib/queries";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await categoryRecord(slug);
  if (!category) return {};
  const description = category.seoDescription || category.description;
  const title = category.seoTitle || category.name;
  return { title, description, alternates: { canonical: absoluteUrl(`/${slug}`) }, openGraph: { title, description, url: absoluteUrl(`/${slug}`) } };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const category = await categoryRecord(slug);
  if (!category) notFound();
  const search = await searchParams;
  const page = Math.max(1, Number.parseInt(search.page || "1", 10) || 1);
  const [articles, count] = category.id ? await Promise.all([latestArticles(12, (page - 1) * 12, category.id), publishedCount(category.id)]) : [[], 0];
  return <><section className="page-hero"><div className="page-width"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span>{category.name}</nav><span className="eyebrow">THE INSIGHTS DESK / {String(categoryDefinitions.findIndex((item) => item.slug === slug) + 1).padStart(2, "0")}</span><h1>{category.name}<em>.</em></h1><p>{category.description}</p></div></section><section className="section-space"><div className="page-width listing-layout"><div><div className="section-rule"><h2>{count ? `${count} published ${count === 1 ? "story" : "stories"}` : "Stories in development"}</h2><span className="eyebrow">LATEST FIRST</span></div>{articles.length ? <div className="listing-grid" style={{ marginTop: 28 }}>{articles.map((article) => <ArticleCard article={article} key={article.id} />)}</div> : <EmptyState compact category={category.name} />}<Pagination page={page} total={count} basePath={`/${slug}`} /></div><aside className="listing-sidebar"><h3>Explore more</h3><div>{categoryDefinitions.filter((item) => item.slug !== slug).map((item) => <Link href={`/${item.slug}`} key={item.slug}>{item.name} ↗</Link>)}</div></aside></div></section></>;
}
