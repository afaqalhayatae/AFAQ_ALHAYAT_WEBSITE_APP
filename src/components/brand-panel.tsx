import Image from "next/image";
import type { ReactNode } from "react";
import { CleaningScene, HeroScene, MaintenanceScene, PestControlScene } from "./brand-scenes";

type BrandCategory = "maintenance" | "cleaning" | "pest-control";

type BrandPanelBaseProps = {
  icon: ReactNode;
  variant?: "hero" | "card";
  category?: BrandCategory;
  className?: string;
  /**
   * Object-position for the photo (Visual Quality Correction Pass) —
   * defaults to centered, matching every existing caller's card-shaped
   * (near-4:3) source photos. Only needed when a wider, hero-composed
   * source image (e.g. a 21:9 photo with its subject off-center) is
   * reused inside this 4:3 card slot, so the subject doesn't get
   * cropped out by a plain center crop — same idea as the homepage
   * hero's own `object-[80%_center]` treatment.
   */
  imagePosition?: string;
  /**
   * `sizes` hint for the underlying `next/image` (Homepage Visual Fix Plan
   * P1-3) — defaults to the panel's original 2-column-hero assumption
   * (50vw desktop / 100vw mobile), which is accurate for callers laid out
   * in a true `desktop:grid-cols-2` split (locations, service-detail hero).
   * Callers in denser grids (3-4 columns) should pass a narrower value
   * matching their real column width instead of relying on this default.
   */
  sizes?: string;
};

/**
 * Passing `src` (a real photo) requires passing a real `alt` too — this
 * is the SEO alt-text system (JOB-AGT-WEB-20260726-M4.5): the moment
 * anyone wires in an actual photograph, TypeScript enforces meaningful
 * alt text per ACCESSIBILITY.md/BRAND_IMAGES.md. The illustration path
 * (no `src`) is decorative and already `aria-hidden`, so it needs none.
 */
type BrandPanelProps =
  | (BrandPanelBaseProps & { src: string; alt: string })
  | (BrandPanelBaseProps & { src?: undefined; alt?: string });

const CATEGORY_GRADIENTS: Record<BrandCategory, string> = {
  maintenance: "from-(--color-primary) to-[#123f66]",
  cleaning: "from-[#1a5f95] to-[#0d3660]",
  "pest-control": "from-[#0c3d68] to-[#071f38]",
};

const CATEGORY_SCENES: Record<BrandCategory, typeof MaintenanceScene> = {
  maintenance: MaintenanceScene,
  cleaning: CleaningScene,
  "pest-control": PestControlScene,
};

/**
 * Placeholder brand visual used until real company photography is ready:
 * an editorial line-art scene (see brand-scenes.tsx) standing in for an
 * actual photograph, not a generic gradient-and-icon tile. To swap in a
 * real photo later: add a file to `public/brand/images/` following the
 * approved naming convention from 99_STANDARDS/NAMING_CONVENTIONS.md —
 * `<purpose>-<context>-v<N>.webp` (e.g. `hero-homepage-v1.webp`,
 * `ac-maintenance-card-v1.webp`) — and pass its path as `src` plus a real
 * `alt` (required together, see BrandPanelProps below). The illustration
 * is replaced automatically; no other markup changes.
 */
export function BrandPanel({
  icon,
  variant = "card",
  category,
  src,
  alt,
  className = "",
  imagePosition = "center",
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: BrandPanelProps) {
  const gradient = category
    ? CATEGORY_GRADIENTS[category]
    : "from-(--color-primary) to-[#0a2f52]";
  const Scene = category ? CATEGORY_SCENES[category] : variant === "hero" ? HeroScene : null;

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
      />

      {src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          style={{ objectPosition: imagePosition }}
        />
      ) : (
        Scene ? <Scene data-testid="brand-scene" /> : null
      )}
      {/*
       * Icon badge (Final Visual Design Implementation): every caller in
       * this codebase already passes the same `icon` in both its
       * src-present and src-absent call, which only ever worked for the
       * src-absent (illustration) case before this fix — the badge was
       * being silently dropped the moment a real photo was wired in,
       * across ~9 components. Rendered here unconditionally on `icon`
       * so a real photo and its category icon can appear together, per
       * `12_DESIGN_SYSTEM/ICONS.md`'s "الخدمات" (services) usage and
       * LUXURY_DESIGN_DIRECTION.md §5 Service Cards ("relevant image or
       * icon").
       */}
      {icon ? (
        <div className="absolute start-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-(--color-surface)">
          {icon}
        </div>
      ) : null}
    </div>
  );
}
