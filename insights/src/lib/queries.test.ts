import { beforeEach, describe, expect, it, vi } from "vitest";
const findMany = vi.fn(async (_query?: unknown) => { void _query; return []; });
vi.mock("@/lib/db", () => ({ getDb: () => ({ article: { findMany } }) }));
import { latestArticles } from "./queries";
describe("publication visibility", () => {
  beforeEach(() => { findMany.mockClear(); });
  it("recomputes the publication cutoff for every request", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-13T10:00:00Z"));
    await latestArticles();
    vi.setSystemTime(new Date("2026-11-13T10:01:00Z"));
    await latestArticles();
    const first = (findMany.mock.calls[0][0] as { where: { publishedAt: { lte: Date } } }).where.publishedAt.lte;
    const second = (findMany.mock.calls[1][0] as { where: { publishedAt: { lte: Date } } }).where.publishedAt.lte;
    expect(first).toEqual(new Date("2026-11-13T10:00:00Z"));
    expect(second).toEqual(new Date("2026-11-13T10:01:00Z"));
    vi.useRealTimers();
  });
});
