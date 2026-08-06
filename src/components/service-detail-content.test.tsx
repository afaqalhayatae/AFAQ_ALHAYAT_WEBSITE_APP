import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceDetailContent } from "./service-detail-content";
import { getMessages } from "@/i18n/get-messages";

/**
 * Rendering logic extracted verbatim from the pre-restructure
 * src/app/[locale]/services/[slug]/page.tsx (2026-07-30 structure phase)
 * — this test file is that route's old test suite, adapted to call the
 * shared component directly instead of the page function. Assertions
 * are unchanged in substance; only the call shape changed.
 */

describe("ServiceDetailContent", () => {
  it("renders the service name, category, and CTAs", () => {
    render(<ServiceDetailContent locale="en" slug="general-cleaning" />);

    const t = getMessages("en");
    const entry = t.services.entries["general-cleaning"];
    expect(screen.getByRole("heading", { level: 1, name: entry.name })).toBeInTheDocument();
    expect(
      screen.getAllByText(t.services.categories["cleaning-pest-control"])[0]
    ).toBeInTheDocument();

    expect(screen.getAllByRole("link", { name: t.common.requestService })[0]).toHaveAttribute(
      "href",
      "/en/book?service=general-cleaning"
    );
    expect(screen.getAllByRole("link", { name: t.common.whatsappCta })[0]).toHaveAttribute(
      "href",
      "https://wa.me/message/JMZVJDFDQL3VD1"
    );
    // general-cleaning:dubai now has real canonical content (2026-08-03
    // local-SEO expansion pass), so this resolves to the new URL.
    expect(screen.getByRole("link", { name: t.services.detail.viewInDubai })).toHaveAttribute(
      "href",
      "/en/services/cleaning/general-cleaning/dubai"
    );
  });

  // Supersedes the old "Final Production Cleanup Rule" test, written back
  // when the booking form genuinely wasn't functional. It's real now
  // (971-line booking-form.tsx, real /api/bookings submit) — the Owner
  // requested every Request Service CTA site-wide go straight to it,
  // pre-filled with the service slug (2026-08-05).
  it("sends every Request Service CTA straight to the pre-filled booking form", () => {
    render(<ServiceDetailContent locale="en" slug="general-cleaning" />);

    const t = getMessages("en");
    const requestLinks = screen.getAllByRole("link", { name: t.common.requestService });
    expect(requestLinks.length).toBeGreaterThan(0);
    for (const link of requestLinks) {
      expect(link).toHaveAttribute("href", "/en/book?service=general-cleaning");
    }
  });

  it("lists related services from the same category, linked to their new category-scoped URL", () => {
    render(<ServiceDetailContent locale="en" slug="general-cleaning" />);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { name: t.services.detail.relatedTitle })
    ).toBeInTheDocument();
    // Deep Cleaning shares the "Cleaning & Pest Control" category and sits
    // right after General Cleaning in the catalog order, so it's always
    // among the first 3 related services shown (unlike Pest Control,
    // which fell out of the first-3 slice once Villa/Office/
    // Post-Construction/Carpet cleaning were added 2026-07-31 — see
    // service-detail-content.tsx's own comment on why this list is
    // order-dependent rather than hardcoded). The related-service card's
    // accessible name is "Deep Cleaning <description>", so this matches
    // on a leading anchor rather than an exact or unanchored substring —
    // a related blog article's title now also contains "Deep Cleaning"
    // (2026-08-03 blog target completion pass), but never as the first
    // word, so it doesn't collide with this anchored match.
    const deepCleaningLink = screen.getByRole("link", {
      name: new RegExp(`^${t.services.entries["deep-cleaning"].name}\\b`),
    });
    expect(deepCleaningLink).toHaveAttribute("href", "/en/services/cleaning/deep-cleaning");
  });

  it("shows the service-specific process steps (not the generic How It Works block) and closing CTA band, now that general-cleaning has approved content", () => {
    render(<ServiceDetailContent locale="en" slug="general-cleaning" />);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { name: t.services.detail.howItWorksTitle })
    ).toBeInTheDocument();
    // Service Completion Phase (2026-07-31): once a service has real
    // content.process, the generic shared t.home.howItWorks.steps block is
    // skipped in favor of that service's own steps — assert the generic
    // step titles are gone rather than present.
    for (const step of t.home.howItWorks.steps) {
      expect(screen.queryByText(step.title)).not.toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: t.home.cta.title })).toBeInTheDocument();
  });

  it("falls back to the generic How It Works block for a service with no process content", () => {
    // pest-control's own `content` block (SERVICE_DATABASE.json) predates
    // the `process` field and has none, so it should still show the
    // shared, generic steps — the fallback this test guards against
    // regressing.
    render(<ServiceDetailContent locale="en" slug="pest-control" />);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { name: t.services.detail.howItWorksTitle })
    ).toBeInTheDocument();
    for (const step of t.home.howItWorks.steps) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }
  });

  it("shows the Trust and Why Choose Us sections with sitewide, non-service-specific copy", () => {
    render(<ServiceDetailContent locale="en" slug="general-cleaning" />);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { name: t.home.trust.title })).toBeInTheDocument();
    for (const item of t.home.trust.items) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: t.home.whyUs.title })).toBeInTheDocument();
    for (const point of t.home.whyUs.points) {
      expect(screen.getByText(point)).toBeInTheDocument();
    }
  });

  it("shows the related-articles section now that a real post is tagged to general-cleaning (2026-08-02 content-integration pass)", () => {
    render(<ServiceDetailContent locale="en" slug="general-cleaning" />);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { name: t.home.articles.title })).toBeInTheDocument();
  });

  // The real "no tagged or same-category post" example this test used to
  // demonstrate (waterproofing) no longer applies — 2026-08-06's local SEO
  // content pass gave every real catalog service at least a same-category
  // match. The hide-when-empty branch itself is still fully covered at the
  // unit level in blog.test.ts's getPostsForService suite (synthetic data,
  // not tied to real catalog completeness), and the positive case (shows
  // the section once matching content exists) stays covered by the test
  // above this one.

  it("renders the full expanded content and FAQ sections now that general-cleaning has Owner-approved copy (Service Completion Phase, 2026-07-31)", () => {
    render(<ServiceDetailContent locale="en" slug="general-cleaning" />);

    const t = getMessages("en");
    expect(screen.getByText(t.services.detail.includedTitle)).toBeInTheDocument();
    expect(screen.getByText(t.services.detail.commonProblemsTitle)).toBeInTheDocument();
    expect(screen.getByText(t.services.detail.benefitsTitle)).toBeInTheDocument();
    expect(screen.getByText(t.services.detail.safetyTitle)).toBeInTheDocument();
    expect(screen.getByText(t.services.detail.faqTitle)).toBeInTheDocument();
  });

  it("renders nothing for an unknown service slug", () => {
    const { container } = render(<ServiceDetailContent locale="en" slug="not-a-service" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a section breadcrumb linking to the service's category hub", () => {
    render(<ServiceDetailContent locale="en" slug="ac-maintenance" />);

    const t = getMessages("en");
    expect(
      screen.getByRole("link", { name: t.services.sections.maintenance.name })
    ).toHaveAttribute("href", "/en/services/maintenance");
  });
});
