import Image from "next/image";
import type { ReactNode } from "react";
import { CleaningScene, HeroScene, MaintenanceScene, PestControlScene } from "./brand-scenes";

type BrandCategory = "maintenance" | "cleaning" | "pest-control";

type BrandPanelBaseProps = {
  icon: ReactNode;
  variant?: "hero" | "card";
  category?: BrandCategory;
  className?: string;
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
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <>
          {Scene ? <Scene data-testid="brand-scene" /> : null}
          <div className="absolute start-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-(--color-surface)">
            {icon}
          </div>
        </>
      )}
    </div>
  );
}
