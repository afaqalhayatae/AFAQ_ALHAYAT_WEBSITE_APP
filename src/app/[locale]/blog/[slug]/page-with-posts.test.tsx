import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";
import type { BlogPost } from "@/lib/catalog/blog";

const { FIXTURE_POSTS } = vi.hoisted(() => {
  const mainPost: BlogPost = {
    slug: "ac-maintenance-schedule",
    category: "general-maintenance",
    title: { en: "How often to service your AC", ar: "كم مرة يجب صيانة المكيف" },
    excerpt: { en: "A general maintenance guide.", ar: "دليل صيانة عام." },
    publishDate: "2026-06-01",
    body: {
      en: [
        { type: "heading", id: "overview", text: "Overview" },
        { type: "paragraph", text: "A short overview paragraph for this article." },
        { type: "heading", id: "signs", text: "Signs to watch for" },
        { type: "list", items: ["Reduced airflow", "Unusual noise"] },
      ],
      ar: [
        { type: "heading", id: "overview", text: "نظرة عامة" },
        { type: "paragraph", text: "فقرة قصيرة تقدم هذا المقال." },
        { type: "heading", id: "signs", text: "علامات يجب ملاحظتها" },
        { type: "list", items: ["ضعف تدفق الهواء", "صوت غير معتاد"] },
      ],
    },
    serviceSlugs: ["ac-maintenance"],
  };

  const relatedPost: BlogPost = {
    slug: "plumbing-tips",
    category: "general-maintenance",
    title: { en: "Simple plumbing tips", ar: "نصائح بسيطة للسباكة" },
    excerpt: { en: "Everyday plumbing guidance.", ar: "إرشادات سباكة يومية." },
    publishDate: "2026-05-01",
    body: { en: [], ar: [] },
  };

  return { FIXTURE_POSTS: [mainPost, relatedPost] };
});

vi.mock("@/lib/catalog/blog", async () => {
  const actual = await vi.importActual<typeof import("@/lib/catalog/blog")>("@/lib/catalog/blog");
  return {
    ...actual,
    BLOG_POSTS: FIXTURE_POSTS,
    getBlogPostBySlug: (slug: string) => FIXTURE_POSTS.find((post) => post.slug === slug),
    getLatestPosts: (excludeSlug?: string, limit = 4) =>
      actual.getLatestPosts(excludeSlug, limit, FIXTURE_POSTS),
    getRelatedPosts: (post: BlogPost, limit = 3) =>
      actual.getRelatedPosts(post, limit, FIXTURE_POSTS),
  };
});

import BlogArticlePage from "./page";

describe("BlogArticlePage with a published article", () => {
  it("renders the title, meta row, TOC, body, related services/articles, CTA, and Article schema", async () => {
    const element = await BlogArticlePage({
      params: Promise.resolve({ locale: "en", slug: "ac-maintenance-schedule" }),
    });
    render(element);

    const t = getMessages("en");

    expect(
      screen.getByRole("heading", { level: 1, name: "How often to service your AC" })
    ).toBeInTheDocument();
    // Category label appears in the article header and again on the
    // related-article card below (same category).
    expect(
      screen.getAllByText(t.services.categories["general-maintenance"]).length
    ).toBeGreaterThan(0);

    // Reading time + published date meta row.
    expect(screen.getByText(/min read/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(t.blog.article.publishedLabel))).toBeInTheDocument();

    // Table of contents lists both headings and links to their anchors.
    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
    const tocLink = screen.getByRole("link", { name: "Signs to watch for" });
    expect(tocLink).toHaveAttribute("href", "#signs");

    // Body renders the paragraph and list content.
    expect(screen.getByText("A short overview paragraph for this article.")).toBeInTheDocument();
    expect(screen.getByText("Reduced airflow")).toBeInTheDocument();

    // Related service link — appears both in the body's "Related services"
    // list and again in the desktop sidebar.
    const relatedServiceLinks = screen.getAllByRole("link", { name: "AC Maintenance" });
    expect(relatedServiceLinks.length).toBeGreaterThan(0);
    expect(relatedServiceLinks[0]).toHaveAttribute("href", "/en/services/ac-maintenance");

    // Related articles (same category).
    expect(screen.getByRole("heading", { name: t.blog.article.relatedArticles })).toBeInTheDocument();
    // Appears in "Related articles" and again in the sidebar's "Latest articles".
    expect(screen.getAllByText("Simple plumbing tips").length).toBeGreaterThan(0);

    // Conversion CTA band.
    expect(screen.getByRole("link", { name: t.home.cta.button })).toHaveAttribute(
      "href",
      "/en/contact"
    );
    // WhatsApp CTA appears in both the main conversion band and the sidebar.
    const whatsappLinks = screen.getAllByRole("link", { name: t.common.whatsappCta });
    expect(whatsappLinks.length).toBeGreaterThan(0);
    expect(whatsappLinks[0]).toHaveAttribute("href", "https://wa.me/message/JMZVJDFDQL3VD1");

    // Article JSON-LD, built from the same post being rendered.
    const schema = document.querySelector('script[type="application/ld+json"]');
    expect(schema).not.toBeNull();
    const parsed = JSON.parse(schema?.innerHTML ?? "{}");
    expect(parsed["@type"]).toBe("Article");
    expect(parsed.headline).toBe("How often to service your AC");
    expect(parsed.datePublished).toBe("2026-06-01");
    expect(parsed.author).toEqual({ "@type": "Organization", name: "AFAQ AL HAYAT" });
  });

  it("renders the same article correctly in Arabic, including RTL body content", async () => {
    const element = await BlogArticlePage({
      params: Promise.resolve({ locale: "ar", slug: "ac-maintenance-schedule" }),
    });
    render(element);

    expect(screen.getByRole("heading", { level: 1, name: "كم مرة يجب صيانة المكيف" })).toBeInTheDocument();
    expect(screen.getByText("فقرة قصيرة تقدم هذا المقال.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "علامات يجب ملاحظتها" })).toHaveAttribute(
      "href",
      "#signs"
    );
  });
});
