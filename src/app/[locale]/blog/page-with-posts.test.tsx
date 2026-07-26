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
  it("renders a featured article, latest articles, category groups, and service-related articles", async () => {
    const element = await BlogPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");

    // Most recent post is featured (it also appears again in its category
    // group further down the page).
    expect(screen.getByText(t.blog.featuredLabel)).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: /A deep cleaning checklist/ }).length
    ).toBeGreaterThan(0);

    // The remaining post shows in "Latest articles" (rendered both in the
    // main content and again in the sidebar) and again under "Related
    // services", since it also carries a serviceSlug.
    expect(
      screen.getAllByRole("heading", { name: t.blog.sidebar.latestArticles }).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("How often to service your AC").length).toBeGreaterThan(0);

    // Category groupings render for both categories present.
    expect(
      screen.getByRole("heading", { name: t.services.categories["general-maintenance"] })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: t.services.categories["cleaning-pest-control"] })
    ).toBeInTheDocument();

    // The post with a related service shows in the service-related section.
    expect(screen.getByRole("heading", { name: t.blog.article.relatedServices })).toBeInTheDocument();
  });
});
