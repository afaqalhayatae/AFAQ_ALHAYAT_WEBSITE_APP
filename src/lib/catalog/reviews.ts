/**
 * Verified customer review registry (JOB-AGT-WEB-20260726-M4.4 — Trust
 * Signals readiness). Architecture only: `VERIFIED_REVIEWS` stays empty
 * until real, verified Google Business Profile reviews are added by the
 * owner. Nothing here may ever hold a fabricated name, rating, or quote —
 * per the Hard Publication Block on "fake ... reviews" and this ticket's
 * explicit rule, this list is empty by design, not a placeholder awaiting
 * copy. `ReviewsSection` (src/components/reviews-section.tsx) reads
 * straight from this array and its own AggregateRating schema, so adding
 * a verified review here is the entire publishing step — no other code
 * changes are needed.
 */

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  publishedAt: string;
  source: "google-business-profile";
  sourceUrl?: string;
};

export const VERIFIED_REVIEWS: Review[] = [];

/**
 * Derives the aggregate rating from the exact reviews given — never
 * invented. Takes `reviews` explicitly (rather than reading
 * `VERIFIED_REVIEWS` itself) so `ReviewsSection` stays a pure,
 * props-only component, consistent with `ServiceFaqSection`.
 */
export function getAggregateRating(reviews: Review[]): { average: number; count: number } | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return { average: total / reviews.length, count: reviews.length };
}
