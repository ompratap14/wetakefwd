import Link from "next/link";
import type { ArticleWithRelations } from "@/lib/queries";
import { plainText } from "@/lib/article-content";
import { CategoryTag } from "@/components/category-tag";
import { CoverImage } from "@/components/cover-image";

export function ArticleCard({ article, large = false }: { article: ArticleWithRelations; large?: boolean }) {
  const readingTime = Math.max(1, Math.ceil(plainText(article.body).split(/\s+/).length / 220));
  return <article className={`article-card ${large ? "article-card-large" : ""}`}>
    <CoverImage article={article} sizes={large ? "(max-width: 800px) 100vw, 60vw" : "(max-width: 700px) 100vw, 33vw"} />
    <div className="article-card-meta"><Link href={`/${article.category.slug}`}><CategoryTag name={article.category.name} slug={article.category.slug} /></Link></div>
    <h3><Link href={`/article/${article.slug}`}>{article.title}</Link></h3>
    <p className="article-card-reading">{readingTime} min read</p>
  </article>;
}
