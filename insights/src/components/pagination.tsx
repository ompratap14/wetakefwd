import Link from "next/link";

export function Pagination({ page, total, basePath, query }: { page: number; total: number; basePath: string; query?: string }) {
  const pages = Math.ceil(total / 12);
  if (pages <= 1) return null;
  const href = (number: number) => `${basePath}?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(number) })}`;
  return <nav className="pagination" aria-label="Pagination">{page > 1 && <Link href={href(page - 1)}>← Previous</Link>}{Array.from({ length: pages }, (_, index) => index + 1).filter((number) => number === 1 || number === pages || Math.abs(number - page) <= 2).map((number) => number === page ? <span className="active" aria-current="page" key={number}>{number}</span> : <Link key={number} href={href(number)}>{number}</Link>)}{page < pages && <Link href={href(page + 1)}>Next →</Link>}</nav>;
}
