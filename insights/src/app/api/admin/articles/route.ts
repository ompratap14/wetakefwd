import { z } from "zod";
import { requireDb } from "@/lib/db";
import { apiError, authorizeWrite } from "@/lib/security";
import { slugify } from "@/lib/site";
import { Prisma } from "@/generated/prisma/client";
const source = z.object({ title: z.string().min(1), url: z.url() });
const articleSchema = z.object({ id: z.string().optional(), title: z.string().min(5).max(200), slug: z.string().min(3).max(100), subtitle: z.string().max(500).nullable().optional(), summary: z.string().min(20).max(1000), body: z.record(z.string(), z.unknown()), coverImageUrl: z.url().nullable().optional(), coverImageAlt: z.string().max(200).nullable().optional(), authorId: z.string(), categoryId: z.string(), tagNames: z.array(z.string().min(1).max(50)).max(12).default([]), sources: z.array(source).max(30).default([]), status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]), isFeatured: z.boolean().default(false), scheduledFor: z.iso.datetime().nullable().optional(), seoTitle: z.string().max(200).nullable().optional(), seoDescription: z.string().max(500).nullable().optional(), canonicalOverride: z.url().nullable().optional() });
export async function POST(request: Request) {
  try {
    await authorizeWrite(request);
    const parsed = articleSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ message: "Check the article fields.", details: parsed.error.flatten() }, { status: 400 });
    const { id, tagNames, sources, ...data } = parsed.data;
    if (data.status === "SCHEDULED" && (!data.scheduledFor || new Date(data.scheduledFor) <= new Date())) return Response.json({ message: "Choose a future publication time." }, { status: 400 });
    const db = requireDb();
    const existing = id ? await db.article.findUnique({ where: { id } }) : null;
    if (id && !existing) return Response.json({ message: "Article not found." }, { status: 404 });
    const publishedAt = data.status === "PUBLISHED" ? existing?.publishedAt || new Date() : data.status === "SCHEDULED" ? null : existing?.publishedAt || null;
    const tagIds = await Promise.all([...new Set(tagNames.map((name) => name.trim()).filter(Boolean))].map(async (name) => (await db.tag.upsert({ where: { slug: slugify(name) }, create: { slug: slugify(name), name }, update: { name } })).id));
    const payload = { ...data, body: JSON.parse(JSON.stringify(data.body)) as Prisma.InputJsonValue, scheduledFor: data.status === "SCHEDULED" ? new Date(data.scheduledFor!) : null, publishedAt, sources };
    const article = id ? await db.article.update({ where: { id }, data: { ...payload, articleTags: { deleteMany: {}, create: tagIds.map((tagId) => ({ tagId })) } } }) : await db.article.create({ data: { ...payload, articleTags: { create: tagIds.map((tagId) => ({ tagId })) } } });
    return Response.json({ ok: true, id: article.id, slug: article.slug });
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try { await authorizeWrite(request, true); const { id } = await request.json(); if (typeof id !== "string") return Response.json({ message: "Invalid article." }, { status: 400 }); await requireDb().article.delete({ where: { id } }); return Response.json({ ok: true }); } catch (error) { return apiError(error); }
}
