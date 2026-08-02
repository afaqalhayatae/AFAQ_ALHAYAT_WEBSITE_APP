import { describe, expect, it } from "vitest";
import BlogArticlePage, { generateStaticParams } from "./page";
import { BLOG_POSTS } from "@/lib/catalog/blog";

describe("BlogArticlePage", () => {
  it("generates a static param for every published, non-demo post (2026-08-02 content-integration pass)", () => {
    expect(BLOG_POSTS.length).toBeGreaterThan(0);
    expect(generateStaticParams()).toHaveLength(BLOG_POSTS.length);
    expect(generateStaticParams()).toContainEqual({ slug: "signs-your-ac-needs-maintenance" });
  });

  it("404s for a slug that doesn't exist", async () => {
    await expect(
      BlogArticlePage({ params: Promise.resolve({ locale: "en", slug: "not-a-real-slug" }) })
    ).rejects.toThrow();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      BlogArticlePage({ params: Promise.resolve({ locale: "fr", slug: "not-a-real-slug" }) })
    ).rejects.toThrow();
  });
});
