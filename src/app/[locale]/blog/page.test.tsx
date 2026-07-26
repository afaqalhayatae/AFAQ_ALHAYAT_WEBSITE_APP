import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogPage from "./page";
import { getMessages } from "@/i18n/get-messages";
import { BLOG_POSTS } from "@/lib/catalog/blog";

describe("BlogPage", () => {
  it("shows the demo-content banner while BLOG_POSTS holds only temporary demo posts", async () => {
    // Guards the test's own premise: if this ever fails, BLOG_POSTS no
    // longer matches the "demo data only" state these tests assume —
    // see src/lib/catalog/blog.ts's DEMO_BLOG_POSTS block.
    expect(BLOG_POSTS.every((post) => post.isDemo)).toBe(true);

    const element = await BlogPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText(t.blog.demoNotice)).toBeInTheDocument();
  });

  it("renders the featured article and latest articles from the demo data", async () => {
    const element = await BlogPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText(t.blog.featuredLabel)).toBeInTheDocument();
    // Appears both in the main content and again in the sidebar.
    expect(
      screen.getAllByRole("heading", { name: t.blog.sidebar.latestArticles }).length
    ).toBeGreaterThan(0);
  });

  it("rejects an unsupported locale", async () => {
    await expect(BlogPage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow();
  });
});
