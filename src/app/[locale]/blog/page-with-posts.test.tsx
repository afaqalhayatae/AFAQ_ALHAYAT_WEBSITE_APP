import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";
import type { BlogPost } from "@/lib/catalog/blog";

const { FIXTURE_POSTS } = vi.hoisted(() => {
  const posts: BlogPost[] = [
    {
      slug: "ac-maintenance-schedule",
      category: "general-maintenance",
      title: { en: "How often to service your AC", ar: "كم مرة يجب صيانة المكيف" },
      excerpt: { en: "A general maintenance guide.", ar: "دليل صيانة عام." },
      publishDate: "2026-06-01",
      body: { en: [], ar: [] },
      serviceSlugs: ["ac-maintenance"],
    },
    {
      slug: "deep-cleaning-checklist",
      category: "cleaning-pest-control",
      title: { en: "A deep cleaning checklist", ar: "قائمة تنظيف عميق" },
      excerpt: { en: "What a deep clean covers.", ar: "ما يشمله التنظيف العميق." },
      publishDate: "2026-07-01",
      body: { en: [], ar: [] },
    },
  ];
  return { FIXTURE_POSTS: posts };
});

vi.mock("@/lib/catalog/blog", async () => {
  const actual = await vi.importActual<typeof import("@/lib/catalog/blog")>("@/lib/catalog/blog");
  return {
    ...actual,
    BLOG_POSTS: FIXTURE_POSTS,
    getLatestPosts: (excludeSlug?: string, limit = 4) =>
      actual.getLatestPosts(excludeSlug, limit, FIXTURE_POSTS),
  };
});

import BlogPage from "./page";

describe("BlogPage with published articles", () => {
  it("renders a featured article plus every other article exactly once, in a single grid (Blog Layout Redesign, 2026-08-07)", async () => {
    // The old layout showed the same card in "Latest articles", again in
    // its category group, and again in "Related services" if it had a
    // serviceSlug — this redesign replaces all of that with one
    // de-duplicated grid, so no card repeats anywhere on the page.
    const element = await BlogPage({ params: Promise.resolve({ locale: "en" }), searchParams: Promise.resolve({}) });
    render(element);

    const t = getMessages("en");

    // Most recent post is featured.
    expect(screen.getByText(t.blog.featuredLabel)).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: /A deep cleaning checklist/ }).length
    ).toBeGreaterThan(0);

    // The remaining post renders in the main grid, and again in the
    // sidebar's own "latest posts" list (a distinct, smaller component) —
    // but nowhere else. It carries a serviceSlug, which under the old
    // layout would have added a third, fully redundant appearance.
    expect(screen.getAllByText("How often to service your AC").length).toBe(2);

    // The old per-category group headings and the "Related services"
    // section are both gone — their content now lives in the one grid.
    expect(
      screen.queryByRole("heading", { name: t.services.categories["general-maintenance"] })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: t.services.categories["cleaning-pest-control"] })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: t.blog.article.relatedServices })
    ).not.toBeInTheDocument();
  });
});
