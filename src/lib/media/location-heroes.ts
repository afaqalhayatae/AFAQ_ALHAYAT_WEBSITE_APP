/**
 * Approved emirate hero photographs (Visual Asset Completion, 2026-08-05).
 * One real photo per emirate hub page (locations/[slug]/page.tsx) — not
 * reused across pages, per the Owner's explicit 1:1 mapping instruction.
 * Same shape as homepage-hero.ts's single-constant pattern, keyed by the
 * same emirate slugs already used throughout the catalog
 * (src/lib/catalog/locations.ts). width/height are each photo's real
 * pixel dimensions (Unified Hero Design System pass, 2026-08-05) — they
 * vary slightly per photo, so each is measured individually rather than
 * assumed to share one constant.
 */
export type LocationHero = {
  src: string;
  width: number;
  height: number;
  alt: { en: string; ar: string };
};

export const LOCATION_HERO_IMAGES: Partial<Record<string, LocationHero>> = {
  dubai: {
    src: "/brand/images/locations/dubai-home-maintenance-cleaning-service-hero.webp",
    width: 1915,
    height: 821,
    alt: {
      en: "AFAQ AL HAYAT technician polishing a villa terrace floor with the Dubai skyline and Burj Khalifa in the background",
      ar: "فني آفاق الحياة يقوم بتلميع أرضية تراس فيلا وفي الخلفية أفق دبي وبرج خليفة",
    },
  },
  "abu-dhabi": {
    src: "/brand/images/locations/abu-dhabi-home-maintenance-cleaning-service-hero.webp",
    width: 1855,
    height: 848,
    alt: {
      en: "AFAQ AL HAYAT technician polishing a premium villa terrace floor with the Abu Dhabi skyline in the background",
      ar: "فني آفاق الحياة يقوم بتلميع أرضية تراس فيلا فاخرة وفي الخلفية أفق أبوظبي",
    },
  },
  sharjah: {
    src: "/brand/images/locations/sharjah-home-maintenance-cleaning-service-hero.webp",
    width: 1891,
    height: 831,
    alt: {
      en: "AFAQ AL HAYAT technician polishing a villa terrace floor overlooking the Sharjah waterfront at sunset",
      ar: "فني آفاق الحياة يقوم بتلميع أرضية تراس فيلا تطل على واجهة الشارقة البحرية عند الغروب",
    },
  },
  ajman: {
    src: "/brand/images/locations/ajman-home-maintenance-cleaning-service-hero.webp",
    width: 1915,
    height: 821,
    alt: {
      en: "AFAQ AL HAYAT technician polishing a villa terrace floor overlooking the Ajman coastline",
      ar: "فني آفاق الحياة يقوم بتلميع أرضية تراس فيلا تطل على ساحل عجمان",
    },
  },
  "umm-al-quwain": {
    src: "/brand/images/locations/umm-al-quwain-home-maintenance-cleaning-service-hero.webp",
    width: 1915,
    height: 821,
    alt: {
      en: "AFAQ AL HAYAT technician polishing a villa terrace floor overlooking the Umm Al Quwain coastline and mountains",
      ar: "فني آفاق الحياة يقوم بتلميع أرضية تراس فيلا تطل على ساحل وجبال أم القيوين",
    },
  },
  "ras-al-khaimah": {
    src: "/brand/images/locations/ras-al-khaimah-home-maintenance-cleaning-service-hero.webp",
    width: 1915,
    height: 821,
    alt: {
      en: "AFAQ AL HAYAT technician polishing a villa terrace floor with the Ras Al Khaimah coastline and Hajar Mountains in the background",
      ar: "فني آفاق الحياة يقوم بتلميع أرضية تراس فيلا وفي الخلفية ساحل رأس الخيمة وجبال الحجر",
    },
  },
  fujairah: {
    src: "/brand/images/locations/fujairah-home-maintenance-cleaning-service-hero.webp",
    width: 1851,
    height: 849,
    alt: {
      en: "AFAQ AL HAYAT technician polishing a villa terrace floor with the Fujairah coastline and Hajar Mountains in the background",
      ar: "فني آفاق الحياة يقوم بتلميع أرضية تراس فيلا وفي الخلفية ساحل الفجيرة وجبال الحجر",
    },
  },
};

export function getLocationHero(slug: string): LocationHero | undefined {
  return LOCATION_HERO_IMAGES[slug];
}
