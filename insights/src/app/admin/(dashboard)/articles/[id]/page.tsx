import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/article-editor";
import { requireDb } from "@/lib/db";
import { requireUser } from "@/lib/security";
export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) { const id = (await params).id; const [user, article, authors, categories] = await Promise.all([requireUser(), requireDb().article.findUnique({ where: { id }, include: { articleTags: { include: { tag: true } } } }), requireDb().author.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }), requireDb().category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })]); if (!article) notFound(); return <div><Link href="/admin/articles">← Articles</Link><h1>Edit article</h1><ArticleEditor csrf={user.csrfToken} authors={authors} categories={categories} initial={{ ...article, scheduledFor: article.scheduledFor?.toISOString() || null, tagNames: article.articleTags.map((item) => item.tag.name), sources: Array.isArray(article.sources) ? article.sources as { title: string; url: string }[] : [] }} /></div>; }
