/**
 * Approved homepage hero photograph (2026-07-30), same pattern as
 * demo-visuals.ts's single-constant shape. Not service-specific, so it
 * doesn't belong in SERVICE_DATABASE.json — this is the general
 * brand/homepage hero.
 */
export const HOMEPAGE_HERO_SRC = "/brand/images/afaq-alhayat-home-services-hero-banner-uae-21x9.webp";
export const HOMEPAGE_HERO_DIMENSIONS = { width: 1915, height: 821 };

/**
 * Mobile hero crop (Homepage Foundation Alignment) — a narrower slice of
 * the SAME approved photo above (not a new/separate photograph), centered
 * on the same subject bias the desktop crop already uses
 * (object-[80%_center]), so narrow viewports show the subject full-frame
 * instead of a heavily letterboxed 21:9 banner squeezed into a tall
 * viewport.
 */
export const HOMEPAGE_HERO_SRC_MOBILE =
  "/brand/images/afaq-alhayat-home-services-hero-banner-uae-mobile.webp";
export const HOMEPAGE_HERO_MOBILE_DIMENSIONS = { width: 657, height: 821 };

export const HOMEPAGE_HERO_ALT = {
  en: "AFAQ AL HAYAT maintenance technician at a luxury UAE villa with the Dubai skyline in the background",
  ar: "فني صيانة من آفاق الحياة عند فيلا فاخرة في الإمارات وفي الخلفية أفق دبي",
};
