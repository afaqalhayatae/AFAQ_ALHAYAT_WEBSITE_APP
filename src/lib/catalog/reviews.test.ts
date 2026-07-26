import { describe, expect, it } from "vitest";
import { getAggregateRating, VERIFIED_REVIEWS, type Review } from "./reviews";

describe("VERIFIED_REVIEWS", () => {
  it("stays empty by design until real, verified reviews are added", () => {
    expect(VERIFIED_REVIEWS).toEqual([]);
  });
});

describe("getAggregateRating", () => {
  it("returns null for an empty list", () => {
    expect(getAggregateRating([])).toBeNull();
  });

  it("derives the average and count from the given reviews only", () => {
    const reviews: Review[] = [
      {
        id: "rev_1",
        authorName: "A",
        rating: 5,
        text: "",
        publishedAt: "2026-01-01",
        source: "google-business-profile",
      },
      {
        id: "rev_2",
        authorName: "B",
        rating: 3,
        text: "",
        publishedAt: "2026-01-02",
        source: "google-business-profile",
      },
    ];

    expect(getAggregateRating(reviews)).toEqual({ average: 4, count: 2 });
  });
});
