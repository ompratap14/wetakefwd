import { describe, expect, it } from "vitest";
import { absoluteUrl, categoryDefinitions, safeExternalUrl, slugify } from "./site";
describe("publication URLs", () => {
  it("creates stable article slugs", () => expect(slugify("AI & the Future: What's Next? ")).toBe("ai-the-future-what-s-next"));
  it("keeps eight distinct editorial categories", () => expect(new Set(categoryDefinitions.map((item) => item.slug)).size).toBe(8));
  it("rejects unsafe external schemes", () => { expect(safeExternalUrl("javascript:alert(1)")).toBeNull(); expect(safeExternalUrl("https://example.com")).toBe("https://example.com/"); });
  it("builds canonical URLs", () => expect(absoluteUrl("/technology")).toMatch(/^https:\/\/[^/]+\/technology$/));
});
