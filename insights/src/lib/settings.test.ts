import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/db", () => ({ getDb: () => ({ siteSettings: { findUnique: async () => { throw Object.assign(new Error("Table missing"), { code: "P2021" }); } } }) }));
import { getSiteSettings } from "./settings";
describe("first deployment", () => {
  it("uses default branding before the settings table exists", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await getSiteSettings()).toBeNull();
    expect(warning).toHaveBeenCalled();
    warning.mockRestore();
  });
});
