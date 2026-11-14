import Link from "next/link";
import type { ArticleWithRelations } from "@/lib/queries";

export function NumberedList({ articles }: { articles: ArticleWithRelations[] }) {
  return <div className="numbered-list">{articles.map((article, index) => <Link href={`/article/${article.slug}`} key={article.id}>
    <span>{String(index + 1).padStart(2, "0")}</span><strong>{article.title}</strong><i aria-hidden="true">→</i>
  </Link>)}</div>;
}
