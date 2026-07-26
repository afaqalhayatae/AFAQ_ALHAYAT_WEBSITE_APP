import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogArticlePage, { generateMetadata, generateStaticParams } from "./page";
import { getMessages } from "@/i18n/get-messages";
import { BLOG_POSTS } from "@/lib/catalog/blog";

const DEMO_SLUG = "demo-ac-maintenance-schedule";

describe("BlogArticlePage", () => {
  it("generates a static param for each temporary demo post", () => {
    expect(generateStaticParams()).toHaveLength(BLOG_POSTS.length);
    expect(generateStaticParams()).toContainEqual({ slug: DEMO_SLUG });
  });

  it("marks demo posts noindex,follow", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", slug: DEMO_SLUG }),
    });
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("renders the demo banner and never emits Article schema for demo posts", async () => {
    const element = await BlogArticlePage({
      params: Promise.resolve({ locale: "en", slug: DEMO_SLUG }),
    });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText(t.blog.demoNotice)).toBeInTheDocument();
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("404s for a slug that doesn't exist", async () => {
    await expect(
      BlogArticlePage({ params: Promise.resolve({ locale: "en", slug: "not-a-real-slug" }) })
    ).rejects.toThrow();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      BlogArticlePage({ params: Promise.resolve({ locale: "fr", slug: DEMO_SLUG }) })
    ).rejects.toThrow();
  });
});
