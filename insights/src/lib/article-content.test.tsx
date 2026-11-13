import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ArticleContent, headings, plainText } from "./article-content";
const body = { type: "doc", content: [{ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "What comes next?" }] }, { type: "paragraph", content: [{ type: "text", text: "Read more", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] };
describe("article rendering", () => {
  it("provides a matching table of contents", () => { expect(headings(body)).toEqual([{ id: "what-comes-next", text: "What comes next?", level: 2 }]); expect(plainText(body)).toContain("Read more"); });
  it("does not render unsafe links", () => { const html = renderToStaticMarkup(<ArticleContent body={body} />); expect(html).toContain('id="what-comes-next"'); expect(html).not.toContain("javascript:"); });
});
