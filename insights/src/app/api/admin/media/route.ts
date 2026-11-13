import { put } from "@vercel/blob";
import { requireDb } from "@/lib/db";
import { apiError, authorizeWrite } from "@/lib/security";
export async function POST(request: Request) {
  try {
    const user = await authorizeWrite(request);
    const form = await request.formData(); const file = form.get("file"); const alt = String(form.get("alt") || "").trim();
    if (!(file instanceof File) || !file.type.startsWith("image/") || !["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type) || file.size > 5 * 1024 * 1024 || !alt) return Response.json({ message: "Choose a PNG, JPEG, WebP or AVIF image under 5 MB and provide alt text." }, { status: 400 });
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100);
    const blob = await put(`insights/${crypto.randomUUID()}-${cleanName}`, file, { access: "public", addRandomSuffix: false, contentType: file.type });
    const media = await requireDb().media.create({ data: { pathname: blob.pathname, url: blob.url, alt, mimeType: file.type, bytes: file.size, uploadedByUserId: user.id } });
    return Response.json({ ok: true, media });
  } catch (error) { return apiError(error); }
}
