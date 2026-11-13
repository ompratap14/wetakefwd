import type { ReactNode } from "react";
import { slugify } from "@/lib/site";

type Node = { type?: string; text?: string; attrs?: Record<string, unknown>; marks?: { type: string; attrs?: Record<string, unknown> }[]; content?: Node[] };

export function plainText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const item = node as Node;
  return (item.text || "") + (item.content || []).map(plainText).join("");
}

export function headings(body: unknown) {
  const root = body as Node;
  return (root?.content || []).filter((item) => item.type === "heading").map((item) => ({
    id: slugify(plainText(item)), text: plainText(item), level: Number(item.attrs?.level) || 2,
  }));
}

function safeHref(value: unknown) {
  if (typeof value !== "string") return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try { const url = new URL(value); return ["https:", "http:", "mailto:"].includes(url.protocol) ? value : undefined; }
  catch { return undefined; }
}

function render(node: Node, key: number | string): ReactNode {
  const children = node.content?.map((child, index) => render(child, index));
  if (node.type === "text") {
    let value: ReactNode = node.text || "";
    for (const mark of node.marks || []) {
      if (mark.type === "bold") value = <strong key={key}>{value}</strong>;
      if (mark.type === "italic") value = <em key={key}>{value}</em>;
      if (mark.type === "code") value = <code key={key}>{value}</code>;
      if (mark.type === "link" && safeHref(mark.attrs?.href)) value = <a key={key} href={safeHref(mark.attrs?.href)} rel="nofollow noopener noreferrer">{value}</a>;
    }
    return value;
  }
  switch (node.type) {
    case "doc": return <div key={key}>{children}</div>;
    case "paragraph": return <p key={key}>{children}</p>;
    case "heading": { const level = Math.min(3, Math.max(2, Number(node.attrs?.level) || 2)); const id = slugify(plainText(node)); return level === 2 ? <h2 id={id} key={key}>{children}</h2> : <h3 id={id} key={key}>{children}</h3>; }
    case "bulletList": return <ul key={key}>{children}</ul>;
    case "orderedList": return <ol key={key}>{children}</ol>;
    case "listItem": return <li key={key}>{children}</li>;
    case "blockquote": return <blockquote key={key}>{children}</blockquote>;
    case "codeBlock": return <pre key={key}><code>{plainText(node)}</code></pre>;
    case "horizontalRule": return <hr key={key} />;
    case "hardBreak": return <br key={key} />;
    default: return null;
  }
}

export function ArticleContent({ body }: { body: unknown }) {
  return <div className="article-content">{render(body as Node, "root")}</div>;
}
