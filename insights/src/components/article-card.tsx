import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/site";
import type { ArticleWithRelations } from "@/lib/queries";
import { plainText } from "@/lib/article-content";

export function ArticleCard({ article, large = false }: { article: ArticleWithRelations; large?: boolean }) {
  const readingTime = Math.max(1, Math.ceil(plainText(article.body).split(/\s+/).length / 220));
  return <article className={`article-card ${large ? "article-card-large" : ""}`}>
    <Link href={`/article/${article.slug}`} className="article-card-image" aria-label={`Read ${article.title}`}>
      {article.coverImageUrl ? <Image src={article.coverImageUrl} alt={article.coverImageAlt || article.title} fill sizes={large ? "(max-width: 800px) 100vw, 60vw" : "(max-width: 700px) 100vw, 33vw"} /> : <span className="article-image-fallback" aria-hidden="true"><i></i><b>INSIGHTS<span>.</span></b></span>}
    </Link>
    <div className="article-card-meta"><Link href={`/${article.category.slug}`}>{article.category.name}</Link><span>·</span><time dateTime={article.publishedAt?.toISOString()}>{formatDate(article.publishedAt)}</time><span>·</span><span>{readingTime} min read</span></div>
    <h3><Link href={`/article/${article.slug}`}>{article.title}</Link></h3>
    <p>{article.summary}</p>
    <div className="article-card-bottom"><Link href={`/author/${article.author.slug}`}>By {article.author.name}</Link><Link href={`/article/${article.slug}`} aria-label={`Read ${article.title}`}><ArrowUpRight size={20} /></Link></div>
  </article>;
}
