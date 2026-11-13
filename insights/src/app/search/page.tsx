import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { searchArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const search = await searchParams;
  const query = (search.q || "").trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(search.page || "1", 10) || 1);
  const { articles, count } = await searchArticles(query, 12, (page - 1) * 12);
  return <><section className="page-hero"><div className="page-width"><nav className="breadcrumb"><Link href="/">Home</Link><span>/</span>Search</nav><span className="eyebrow">FIND THE STORY</span><h1>Search <em>Insights.</em></h1><p>Explore the ideas, people and developments we have published.</p><form className="search-form" action="/search" method="get"><input type="search" name="q" defaultValue={query} placeholder="Search articles..." aria-label="Search articles" maxLength={100} required /><button aria-label="Search" type="submit"><SearchIcon size={26} /></button></form></div></section><section className="section-space"><div className="page-width"><div className="section-rule"><h2>{query ? `${count} ${count === 1 ? "result" : "results"} for “${query}”` : "Start with a question"}</h2></div>{articles.length ? <div className="article-grid">{articles.map((article) => <ArticleCard article={article} key={article.id} />)}</div> : <EmptyState compact category={query ? "these search terms" : "the archive"} />}<Pagination page={page} total={count} basePath="/search" query={query} /></div></section></>;
}
