import Link from "next/link";
import { ArticleEditor } from "@/components/article-editor";
import { requireDb } from "@/lib/db";
import { requireUser } from "@/lib/security";
export default async function NewArticle() { const [user, authors, categories] = await Promise.all([requireUser(), requireDb().author.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }), requireDb().category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })]); return <div><Link href="/admin/articles">← Articles</Link><h1>New article</h1>{!authors.length && <p>Create an author before publishing an article.</p>}<ArticleEditor csrf={user.csrfToken} authors={authors} categories={categories} /></div>; }
