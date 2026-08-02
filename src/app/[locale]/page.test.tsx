import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { getMessages } from "@/i18n/get-messages";
import { DEMO_VISUAL_ALT } from "@/lib/media/demo-visuals";
import {
  HOMEPAGE_HERO_ALT,
  HOMEPAGE_HERO_SRC,
  HOMEPAGE_HERO_SRC_MOBILE,
} from "@/lib/media/homepage-hero";
import { getServiceCardImage, getServiceHero } from "@/lib/catalog/service-content";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
import { BLOG_POSTS } from "@/lib/catalog/blog";

describe("HomePage", () => {
  it("renders the localized hero for English", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { level: 1, name: t.home.hero.title })).toBeInTheDocument();
  });

  it("renders the localized hero for Arabic", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "ar" }) });
    render(element);

    const t = getMessages("ar");
    expect(screen.getByRole("heading", { level: 1, name: t.home.hero.title })).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      HomePage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });

  it("renders the Trust, How it works, and Why Us sections with the 3 service-section cards", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { level: 2, name: t.home.trust.title })).toBeInTheDocument();
    for (const item of t.home.trust.items) {
      // Appears twice by design (Master Design Reference Implementation):
      // once in the compact hero trust strip, once in the full dark
      // trust bar — same real copy shown at two sizes for two contexts.
      expect(screen.getAllByText(item.title).length).toBeGreaterThan(0);
    }

    expect(
      screen.getByRole("heading", { level: 2, name: t.home.howItWorks.title })
    ).toBeInTheDocument();
    for (const step of t.home.howItWorks.steps) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }

    expect(screen.getByRole("heading", { level: 2, name: t.home.whyUs.title })).toBeInTheDocument();

    // Homepage now shows exactly the 3 top-level service sections
    // (2026-07-30 structure phase), not a preview of individual services.
    for (const section of [
      t.services.sections.maintenance.name,
      t.services.sections.cleaning.name,
      t.services.sections["pest-control"].name,
    ]) {
      expect(screen.getByRole("heading", { name: section })).toBeInTheDocument();
    }
  });

  it("links the 3 homepage section cards to their category hub pages, not individual services", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("link", { name: t.services.sections.maintenance.name })
    ).toHaveAttribute("href", "/en/services/maintenance");
    expect(screen.getByRole("link", { name: t.services.sections.cleaning.name })).toHaveAttribute(
      "href",
      "/en/services/cleaning"
    );
    expect(
      screen.getByRole("link", { name: t.services.sections["pest-control"].name })
    ).toHaveAttribute("href", "/en/services/pest-control");
  });

  it("points the hero CTAs at WhatsApp and the canonical phone number — exactly the 2-button pattern in the approved Master Design Reference (Master Design Reference Implementation)", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getAllByRole("link", { name: t.home.hero.secondaryCta })[0]
    ).toHaveAttribute("href", "https://wa.me/message/JMZVJDFDQL3VD1");
    expect(screen.getAllByRole("link", { name: t.common.phone })[0]).toHaveAttribute(
      "href",
      "tel:+971585431766"
    );
  });

  it("has a dedicated Booking section linking to the real /book flow (Homepage Foundation Alignment — booking-persistence decision: /api/booking-requests now stores a real, validated BookingRequest, so this is no longer the non-functional form the prior 'never link to /book' rule guarded against)", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByText(t.home.booking.title)).toBeInTheDocument();
    // Two "Book Appointment" links now exist by design (Hero Finalization):
    // the hero's own primary CTA, plus the dedicated Booking section link
    // added in the prior ticket — both must point at the real /book flow.
    const bookingLinks = screen.getAllByRole("link", { name: new RegExp(t.home.booking.button) });
    expect(bookingLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of bookingLinks) {
      expect(link).toHaveAttribute("href", "/en/book");
    }
  });

  it("shows the trust items in the dedicated Trust section (Premium Visual Polish — the hero's own compact copy of these was removed to declutter the hero per LUXURY_DESIGN_DIRECTION.md's 'one dominant action, no excessive badges' rule; the real content still renders once, in the full Trust section below)", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    for (const item of t.home.trust.items) {
      expect(screen.getAllByText(item.title).length).toBeGreaterThan(0);
    }
  });

  // Real branded photography in the hero was approved 2026-07-30 (project
  // decision: AFAQ branding on uniform/equipment is intentional and
  // allowed here), superseding the earlier "illustration only" rule these
  // three tests used to encode. They still guard the same underlying
  // concern — no unapproved or random image can silently appear on the
  // homepage — just against the new approved baseline instead of "no
  // photography at all."

  it("uses the approved real hero photograph — a wide crop at tablet/desktop widths and a narrower crop of the same photo below that (Homepage Foundation Alignment — art-directed responsive hero)", async () => {
    const { container } = render(
      await HomePage({ params: Promise.resolve({ locale: "en" }) })
    );

    // The desktop/tablet crop is only ever exposed via the <picture>'s
    // <source>, not the rendered <img> (which is jsdom's fallback,
    // matching what a narrow-viewport browser would actually pick).
    const desktopSource = container.querySelector('source[media="(min-width: 768px)"]');
    expect(desktopSource).toBeInTheDocument();
    const desktopFileName = HOMEPAGE_HERO_SRC.split("/").pop();
    expect(desktopFileName).toBeTruthy();
    expect(desktopSource?.getAttribute("srcset")).toContain(desktopFileName);

    const heroImage = screen.getByRole("img", { name: HOMEPAGE_HERO_ALT.en });
    expect(heroImage).toBeInTheDocument();
    const mobileFileName = HOMEPAGE_HERO_SRC_MOBILE.split("/").pop();
    expect(mobileFileName).toBeTruthy();
    expect(heroImage.getAttribute("src")).toContain(mobileFileName);
  });

  it("only ever shows an approved photo or the labeled demo placeholder — never a random, unapproved image", async () => {
    // The Latest Articles section renders demo blog posts, whose cards use
    // the real Next <Image> (not the illustration) precisely because
    // they're flagged `isDemo`. As of the 2026-07-30 structure phase the
    // 3 homepage section cards also carry real, already-linked images
    // (each already approved individually — see getServiceCardImage /
    // getServiceHero). Every <img> on the homepage must be one of these
    // known-good sources — nothing else.
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const maintenanceCard = getServiceCardImage("ac-maintenance");
    const cleaningCard = getServiceCardImage("general-cleaning");
    const pestControlHero = getServiceHero("pest-control");
    const approvedAltTexts = [
      DEMO_VISUAL_ALT,
      HOMEPAGE_HERO_ALT.en,
      maintenanceCard?.alt.en,
      cleaningCard?.alt.en,
      pestControlHero?.alt.en,
      // Brand Icon Integration Phase 2 — real approved emirate
      // illustrations, alt text is each emirate's own name.
      ...ALL_EMIRATES.map((emirate) => emirate.name.en),
      // Blog Image System pass (2026-08-06) — every article now carries a
      // real photo from the same approved public/brand/images/services/
      // library, sourced by src/lib/catalog/blog.ts. The Latest Articles
      // section can show any of these depending on publish-date ordering.
      ...BLOG_POSTS.map((post) => post.image?.alt.en).filter(Boolean),
    ].filter((alt): alt is string => Boolean(alt));

    const images = screen.queryAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      expect(approvedAltTexts).toContain(image.getAttribute("alt"));
    }
  });

  it("gives the hero photo real, non-empty accessibility alt text in both languages", async () => {
    expect(HOMEPAGE_HERO_ALT.en.trim().length).toBeGreaterThan(0);
    expect(HOMEPAGE_HERO_ALT.ar.trim().length).toBeGreaterThan(0);

    const elementEn = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(elementEn);
    expect(screen.getByRole("img", { name: HOMEPAGE_HERO_ALT.en })).toBeInTheDocument();
  });

  it("shows the Latest Articles section now that real posts are published (2026-08-02 content-integration pass)", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 2, name: t.home.articles.title })
    ).toBeInTheDocument();
  });

  it("shows the FAQ section now that real FAQs are published (2026-08-04 final website completion pass)", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 2, name: t.home.faq.title })
    ).toBeInTheDocument();
  });

  it("shows no fake review card while VERIFIED_REVIEWS is empty (Final Clean Preview Pass)", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);
    expect(screen.queryByText("★★★★★")).not.toBeInTheDocument();
  });

  it("shows Service Areas with all 7 emirates", async () => {
    const element = await HomePage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { level: 2, name: t.home.areas.title })).toBeInTheDocument();
    for (const emirate of ALL_EMIRATES) {
      expect(screen.getByRole("link", { name: emirate.name.en })).toBeInTheDocument();
    }
    // All 7 emirates now have a real page (2026-08-02 content-integration pass).
    expect(screen.getByRole("link", { name: "Abu Dhabi" })).toHaveAttribute(
      "href",
      "/en/locations/abu-dhabi"
    );
    expect(screen.getByRole("link", { name: "Dubai" })).toHaveAttribute(
      "href",
      "/en/locations/dubai"
    );
  });
});
