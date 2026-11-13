import { MediaUploader } from "@/components/media-uploader";
import { requireDb } from "@/lib/db";
import { requireUser } from "@/lib/security";
import Image from "next/image";
export default async function MediaAdmin() { const [user, media] = await Promise.all([requireUser(), requireDb().media.findMany({ orderBy: { createdAt: "desc" }, take: 100 })]); return <div><span className="eyebrow">ASSETS</span><h1>Media library</h1><p>Upload images with descriptive alt text. Copy the URL into an article cover image field.</p><MediaUploader csrf={user.csrfToken} /><div className="media-grid">{media.map((item) => <div key={item.id}><Image src={item.url} alt={item.alt} width={200} height={130} /><strong>{item.alt}</strong><input readOnly value={item.url} onFocus={(event) => event.currentTarget.select()} /></div>)}</div></div>; }
