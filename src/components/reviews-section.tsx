import type { getMessages } from "@/i18n/get-messages";
import { getAggregateRating, type Review } from "@/lib/catalog/reviews";
import { COMPANY_NAME } from "@/lib/brand/links";

type Messages = ReturnType<typeof getMessages>;

/**
 * Renders verified customer reviews (JOB-AGT-WEB-20260726-M4.4). Returns
 * null while `VERIFIED_REVIEWS` is empty — same gating pattern as
 * `ServiceFaqSection`: nothing displays and no schema is emitted until
 * real, verified reviews exist. Ratings/review counts are never invented;
 * `getAggregateRating()` derives them from the exact reviews rendered.
 */
export function ReviewsSection({
  title,
  reviews,
  t,
}: {
  title: string;
  reviews: Review[];
  t: Messages;
}) {
  if (reviews.length === 0) return null;

  const aggregate = getAggregateRating(reviews);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    ...(aggregate
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggregate.average,
            reviewCount: aggregate.count,
          },
        }
      : {}),
    review: reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.authorName },
      reviewRating: { "@type": "Rating", ratingValue: review.rating },
      reviewBody: review.text,
    })),
  };

  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h2 className="text-h3 font-bold text-(--color-text-primary)">{title}</h2>
      <ul className="mt-space-4 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-2xl border border-(--color-border) p-space-4">
            <p className="font-semibold text-(--color-text-primary)">{review.authorName}</p>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">{review.text}</p>
          </li>
        ))}
      </ul>
      <p className="mt-space-2 text-small text-(--color-text-muted)">
        {t.about.reviews.sourceNote}
      </p>
    </section>
  );
}
