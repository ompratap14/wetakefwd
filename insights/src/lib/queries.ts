import { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import { categoryBySlug } from "@/lib/site";

export const articleInclude = { author: true, category: true } satisfies Prisma.ArticleInclude;
export type ArticleWithRelations = Prisma.ArticleGetPayload<{ include: typeof articleInclude }>;

const publishedWhere = () => ({ status: "PUBLISHED" as const, publishedAt: { lte: new Date() } });

export async function latestArticles(take = 12, skip = 0, categoryId?: string): Promise<ArticleWithRelations[]> {
  const db = getDb();
  if (!db) return [];
  return db.article.findMany({
    where: { ...publishedWhere(), ...(categoryId ? { categoryId } : {}) },
    include: articleInclude,
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take, skip,
  });
}

export async function publishedCount(categoryId?: string) {
  const db = getDb();
  if (!db) return 0;
  return db.article.count({ where: { ...publishedWhere(), ...(categoryId ? { categoryId } : {}) } });
}

export async function featuredArticle(): Promise<ArticleWithRelations | null> {
  const db = getDb();
  if (!db) return null;
  return db.article.findFirst({ where: { ...publishedWhere(), isFeatured: true }, include: articleInclude, orderBy: { publishedAt: "desc" } });
}

export async function categoryRecord(slug: string) {
  const definition = categoryBySlug(slug);
  const db = getDb();
  const record = db ? await db.category.findUnique({ where: { slug } }) : null;
  if (!definition && !record) return null;
  return { ...definition, ...record, slug };
}

export async function articleBySlug(slug: string) {
  const db = getDb();
  if (!db) return null;
  return db.article.findFirst({ where: { slug, ...publishedWhere() }, include: { ...articleInclude, articleTags: { include: { tag: true } } } });
}

export async function authorBySlug(slug: string) {
  const db = getDb();
  return db?.author.findUnique({ where: { slug } }) ?? null;
}

export async function authorArticles(authorId: string, take = 12, skip = 0) {
  const db = getDb();
  if (!db) return [];
  return db.article.findMany({ where: { ...publishedWhere(), authorId }, include: articleInclude, orderBy: { publishedAt: "desc" }, take, skip });
}

export async function searchArticles(query: string, take = 12, skip = 0) {
  const db = getDb();
  if (!db || !query.trim()) return { articles: [] as ArticleWithRelations[], count: 0 };
  const where: Prisma.ArticleWhereInput = { ...publishedWhere(), OR: [
    { title: { contains: query, mode: "insensitive" } },
    { summary: { contains: query, mode: "insensitive" } },
    { category: { name: { contains: query, mode: "insensitive" } } },
    { articleTags: { some: { tag: { name: { contains: query, mode: "insensitive" } } } } },
  ] };
  const [articles, count] = await Promise.all([
    db.article.findMany({ where, include: articleInclude, orderBy: { publishedAt: "desc" }, take, skip }),
    db.article.count({ where }),
  ]);
  return { articles, count };
}

