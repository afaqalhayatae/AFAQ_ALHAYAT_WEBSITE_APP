import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogPostCard } from "./blog-post-card";
import { getMessages } from "@/i18n/get-messages";
import type { BlogPost } from "@/lib/catalog/blog";

const t = getMessages("en");

const post: BlogPost = {
  slug: "sample-article",
  category: "cleaning-pest-control",
  title: { en: "Sample article", ar: "مقال تجريبي" },
  excerpt: { en: "A short excerpt.", ar: "مقتطف قصير." },
  publishDate: "2026-01-01",
  body: { en: [], ar: [] },
};

describe("BlogPostCard", () => {
  it("renders the category label, title, excerpt, and a link to the article", () => {
    render(<BlogPostCard post={post} locale="en" t={t} />);

    expect(screen.getByText(t.services.categories["cleaning-pest-control"])).toBeInTheDocument();
    expect(screen.getByText("A short excerpt.")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Sample article/ })[0]).toHaveAttribute(
      "href",
      "/en/blog/sample-article"
    );
  });

  it("uses the company-guides label for that category", () => {
    render(<BlogPostCard post={{ ...post, category: "company-guides" }} locale="en" t={t} />);
    expect(screen.getByText(t.blog.categories.companyGuides)).toBeInTheDocument();
  });
});
