import Image from "next/image";
import Link from "next/link";
import { ForwardArrow } from "@/components/forward-arrow";

const variants = ["navy", "light", "ink", "deep"] as const;

function coverVariant(slug: string) {
  const value = [...slug].reduce((total, character) => total + character.charCodeAt(0), 0);
  return variants[value % variants.length];
}

export function CoverImage({ article, priority = false, sizes = "(max-width: 768px) 100vw, 33vw", linked = true }: {
  article: { slug: string; title: string; coverImageUrl: string | null; coverImageAlt: string | null; category: { name: string } };
  priority?: boolean;
  sizes?: string;
  linked?: boolean;
}) {
  const content = article.coverImageUrl ? <Image src={article.coverImageUrl} alt={article.coverImageAlt || article.title} fill sizes={sizes} priority={priority} /> : <>
    <span className="cover-label">INSIGHTS · {article.category.name}</span>
    <strong>{article.title}</strong>
    <ForwardArrow className="cover-arrow" />
  </>;
  if (!linked) return <div className={`cover-image cover-${coverVariant(article.slug)}`}>{content}</div>;
  return <Link href={`/article/${article.slug}`} className={`cover-image cover-${coverVariant(article.slug)}`} aria-label={`Read ${article.title}`}>
    {content}
  </Link>;
}
