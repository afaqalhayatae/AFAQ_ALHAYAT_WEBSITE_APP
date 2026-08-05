import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";
import type { BlogPost } from "@/lib/catalog/blog";
import { getServiceBySlug } from "@/lib/catalog/services";
import type { Announcement } from "@/lib/catalog/announcements";

const t = getMessages("en");

const OFFER: Announcement = {
  id: "test-offer",
  type: "limited-time-offer",
  message: { en: "Offer message", ar: "رسالة العرض" },
  ctaLabel: { en: "See Offer", ar: "عرض العرض" },
  ctaHref: "/services/pest-control",
  startAt: "2020-01-01T00:00:00.000Z",
  endAt: "2099-01-01T00:00:00.000Z",
};

let activeAnnouncement: Announcement | null = null;

vi.mock("@/lib/catalog/announcements", async () => {
  const actual = await vi.importActual<typeof import("@/lib/catalog/announcements")>(
    "@/lib/catalog/announcements"
  );
  return {
    ...actual,
    getActiveAnnouncement: () => activeAnnouncement,
  };
});

const { BlogSidebar } = await import("./blog-sidebar");

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
      "/en/book"
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

  it("shows the Current Offer block when an active limited-time-offer exists", () => {
    activeAnnouncement = OFFER;
    render(
      <BlogSidebar
        locale="en"
        t={t}
        latestPosts={[]}
        services={[]}
        servicesLabel={t.blog.sidebar.popularServices}
      />
    );

    expect(screen.getByRole("heading", { name: t.blog.sidebar.currentOffer })).toBeInTheDocument();
    expect(screen.getByText("Offer message")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /See Offer/ })).toHaveAttribute(
      "href",
      "/en/services/pest-control"
    );
    activeAnnouncement = null;
  });

  it("omits the Current Offer block when there is no active offer", () => {
    activeAnnouncement = null;
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
      screen.queryByRole("heading", { name: t.blog.sidebar.currentOffer })
    ).not.toBeInTheDocument();
  });
});
