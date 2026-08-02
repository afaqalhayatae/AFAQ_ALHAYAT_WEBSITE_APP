import { describe, expect, it } from "vitest";
import { getLatestPosts, getPostsForService, getRelatedPosts, type BlogPost } from "./blog";

const post = (overrides: Partial<BlogPost> & Pick<BlogPost, "slug">): BlogPost => ({
  category: "general-maintenance",
  title: { en: overrides.slug, ar: overrides.slug },
  excerpt: { en: "", ar: "" },
  publishDate: "2026-01-01",
  body: { en: [], ar: [] },
  ...overrides,
});

describe("getLatestPosts", () => {
  it("returns posts newest-first", () => {
    const posts = [
      post({ slug: "a", publishDate: "2026-01-01" }),
      post({ slug: "b", publishDate: "2026-03-01" }),
      post({ slug: "c", publishDate: "2026-02-01" }),
    ];

    expect(getLatestPosts(undefined, 10, posts).map((p) => p.slug)).toEqual(["b", "c", "a"]);
  });

  it("excludes the given slug and respects the limit", () => {
    const posts = [
      post({ slug: "a", publishDate: "2026-01-01" }),
      post({ slug: "b", publishDate: "2026-02-01" }),
      post({ slug: "c", publishDate: "2026-03-01" }),
    ];

    expect(getLatestPosts("c", 1, posts).map((p) => p.slug)).toEqual(["b"]);
  });
});

describe("getRelatedPosts", () => {
  it("prefers same-category posts", () => {
    const target = post({ slug: "target", category: "cleaning-pest-control" });
    const posts = [
      target,
      post({ slug: "same-category", category: "cleaning-pest-control" }),
      post({ slug: "other-category", category: "general-maintenance" }),
    ];

    expect(getRelatedPosts(target, 3, posts).map((p) => p.slug)).toEqual(["same-category"]);
  });

  it("falls back to posts sharing a related service when the category has too few", () => {
    const target = post({
      slug: "target",
      category: "cleaning-pest-control",
      serviceSlugs: ["general-cleaning"],
    });
    const posts = [
      target,
      post({
        slug: "shared-service",
        category: "general-maintenance",
        serviceSlugs: ["general-cleaning"],
      }),
      post({ slug: "unrelated", category: "drainage-water-protection" }),
    ];

    expect(getRelatedPosts(target, 3, posts).map((p) => p.slug)).toEqual(["shared-service"]);
  });

  it("never includes the post itself", () => {
    const target = post({ slug: "target", category: "cleaning-pest-control" });
    expect(getRelatedPosts(target, 3, [target])).toEqual([]);
  });
});

describe("getPostsForService", () => {
  it("prefers posts directly tagged with the service slug", () => {
    const posts = [
      post({ slug: "tagged", category: "cleaning-pest-control", serviceSlugs: ["general-cleaning"] }),
      post({ slug: "same-category-untagged", category: "cleaning-pest-control" }),
      post({ slug: "other-category", category: "general-maintenance" }),
    ];

    expect(
      getPostsForService("general-cleaning", "cleaning-pest-control", 3, posts).map((p) => p.slug)
    ).toEqual(["tagged", "same-category-untagged"]);
  });

  it("falls back to same-category posts when nothing is directly tagged", () => {
    const posts = [
      post({ slug: "same-category", category: "cleaning-pest-control" }),
      post({ slug: "other-category", category: "general-maintenance" }),
    ];

    expect(
      getPostsForService("deep-cleaning", "cleaning-pest-control", 3, posts).map((p) => p.slug)
    ).toEqual(["same-category"]);
  });

  it("respects the limit and never duplicates a post", () => {
    const posts = [
      post({ slug: "tagged", category: "cleaning-pest-control", serviceSlugs: ["general-cleaning"] }),
      post({ slug: "same-category", category: "cleaning-pest-control" }),
    ];

    expect(getPostsForService("general-cleaning", "cleaning-pest-control", 1, posts)).toHaveLength(1);
  });
});
