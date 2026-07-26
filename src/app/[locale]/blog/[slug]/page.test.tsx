import { describe, expect, it } from "vitest";
import BlogArticlePage, { generateStaticParams } from "./page";

describe("BlogArticlePage", () => {
  it("generates zero static params while no articles are approved", () => {
    expect(generateStaticParams()).toEqual([]);
  });

  it("404s for any slug, since no articles are published yet", async () => {
    await expect(
      BlogArticlePage({ params: Promise.resolve({ locale: "en", slug: "anything" }) })
    ).rejects.toThrow();
  });
});
