import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogPage from "./page";
import { getMessages } from "@/i18n/get-messages";
import { BLOG_POSTS } from "@/lib/catalog/blog";

describe("BlogPage", () => {
  it("has real, non-demo posts published (2026-08-02 content-integration pass) and no demo article ships", () => {
    // Guards the real safety property: no fake/demo article ships.
    expect(BLOG_POSTS.length).toBeGreaterThan(0);
    expect(BLOG_POSTS.every((post) => !post.isDemo)).toBe(true);
  });

  it("renders real published articles instead of the empty state", async () => {
    const element = await BlogPage({ params: Promise.resolve({ locale: "en" }), searchParams: Promise.resolve({}) });
    render(element);

    const t = getMessages("en");
    expect(screen.queryByText(t.common.comingSoon)).not.toBeInTheDocument();
    expect(screen.queryByText(t.blog.demoNotice)).not.toBeInTheDocument();
    const articleLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/en/blog/"));
    expect(articleLinks.length).toBeGreaterThan(0);
  });

  it("rejects an unsupported locale", async () => {
    await expect(BlogPage({ params: Promise.resolve({ locale: "fr" }), searchParams: Promise.resolve({}) })).rejects.toThrow();
  });
});
