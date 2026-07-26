import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogSidebar } from "./blog-sidebar";
import { getMessages } from "@/i18n/get-messages";
import type { BlogPost } from "@/lib/catalog/blog";
import { getServiceBySlug } from "@/lib/catalog/services";

const t = getMessages("en");

const post: BlogPost = {
  slug: "sample-article",
  category: "general-maintenance",
  title: { en: "Sample article", ar: "مقال تجريبي" },
  excerpt: { en: "", ar: "" },
  publishDate: "2026-01-01",
  body: { en: [], ar: [] },
};

describe("BlogSidebar", () => {
  it("renders latest articles, services, and the CTA card", () => {
    const service = getServiceBySlug("ac-maintenance")!;
    render(
      <BlogSidebar
        locale="en"
        t={t}
        latestPosts={[post]}
        services={[service]}
        servicesLabel={t.blog.sidebar.popularServices}
      />
    );

    expect(screen.getByRole("heading", { name: t.blog.sidebar.latestArticles })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sample article" })).toHaveAttribute(
      "href",
      "/en/blog/sample-article"
    );
    expect(screen.getByRole("heading", { name: t.blog.sidebar.popularServices })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /AC Maintenance/ })).toHaveAttribute(
      "href",
      "/en/services/ac-maintenance"
    );
    expect(screen.getByRole("link", { name: t.common.requestService })).toHaveAttribute(
      "href",
      "/en/contact"
    );
    expect(screen.getByRole("link", { name: t.common.whatsappCta })).toHaveAttribute(
      "href",
      "https://wa.me/message/JMZVJDFDQL3VD1"
    );
  });

  it("omits the latest-articles and services sections when both are empty", () => {
    render(
      <BlogSidebar
        locale="en"
        t={t}
        latestPosts={[]}
        services={[]}
        servicesLabel={t.blog.sidebar.popularServices}
      />
    );

    expect(
      screen.queryByRole("heading", { name: t.blog.sidebar.latestArticles })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: t.blog.sidebar.popularServices })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.common.requestService })).toBeInTheDocument();
  });
});
