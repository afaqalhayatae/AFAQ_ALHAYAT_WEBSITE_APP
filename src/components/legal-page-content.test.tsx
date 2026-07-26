import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalPageContent } from "./legal-page-content";
import type { LegalPageContent as LegalPageContentType } from "@/lib/legal/policies";

const content: LegalPageContentType = {
  title: "Sample Policy",
  lastUpdated: "Last updated: 1 January 2026",
  intro: "Sample intro paragraph.",
  sections: [
    {
      id: "first-section",
      title: "First Section",
      paragraphs: ["First paragraph."],
    },
    {
      id: "second-section",
      title: "Second Section",
      paragraphs: ["Second paragraph."],
      list: ["List item one", "List item two"],
    },
  ],
};

describe("LegalPageContent", () => {
  it("renders the title, intro, and a table of contents linking to each section", () => {
    render(<LegalPageContent content={content} />);

    expect(screen.getByRole("heading", { level: 1, name: "Sample Policy" })).toBeInTheDocument();
    expect(screen.getByText("Sample intro paragraph.")).toBeInTheDocument();
    expect(screen.getByText(content.lastUpdated)).toBeInTheDocument();

    const tocLink = screen.getAllByRole("link", { name: "Second Section" })[0];
    expect(tocLink).toHaveAttribute("href", "#second-section");
  });

  it("renders each section's heading, paragraphs, and optional list", () => {
    render(<LegalPageContent content={content} />);

    expect(screen.getByRole("heading", { name: "First Section" })).toBeInTheDocument();
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Second Section" })).toBeInTheDocument();
    expect(screen.getByText("List item one")).toBeInTheDocument();
    expect(screen.getByText("List item two")).toBeInTheDocument();
  });
});
