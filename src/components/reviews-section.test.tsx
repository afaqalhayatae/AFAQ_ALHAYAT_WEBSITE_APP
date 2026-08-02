import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewsSection } from "./reviews-section";
import { getMessages } from "@/i18n/get-messages";
import type { Review } from "@/lib/catalog/reviews";

const t = getMessages("en");

describe("ReviewsSection", () => {
  it("renders nothing when there are no verified reviews", () => {
    const { container } = render(<ReviewsSection title="Reviews" reviews={[]} t={t} />);
    expect(container).toBeEmptyDOMElement();
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("renders verified reviews and an Organization/AggregateRating schema derived from them", () => {
    const reviews: Review[] = [
      {
        id: "rev_1",
        authorName: "Verified Customer",
        rating: 5,
        text: "Great service.",
        publishedAt: "2026-01-01",
        source: "google-business-profile",
      },
      {
        id: "rev_2",
        authorName: "Another Customer",
        rating: 4,
        text: "Very good.",
        publishedAt: "2026-02-01",
        source: "google-business-profile",
        sourceUrl: "https://g.page/r/example-review",
      },
    ];

    render(<ReviewsSection title="Reviews" reviews={reviews} t={t} />);

    expect(screen.getByRole("heading", { name: "Reviews" })).toBeInTheDocument();
    expect(screen.getByText("Verified Customer")).toBeInTheDocument();
    expect(screen.getByText("Great service.")).toBeInTheDocument();
    expect(screen.getByLabelText("5/5")).toBeInTheDocument();
    expect(screen.getByLabelText("4/5")).toBeInTheDocument();

    const links = screen.getAllByRole("link", { name: t.about.reviews.verifiedLink });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://g.page/r/example-review");

    const schema = document.querySelector('script[type="application/ld+json"]');
    expect(schema).not.toBeNull();
    const parsed = JSON.parse(schema?.innerHTML ?? "{}");
    expect(parsed["@type"]).toBe("Organization");
    expect(parsed.aggregateRating.ratingValue).toBe(4.5);
    expect(parsed.aggregateRating.reviewCount).toBe(2);
    expect(parsed.review).toHaveLength(2);
    expect(parsed.review[0].author.name).toBe("Verified Customer");
  });
});
