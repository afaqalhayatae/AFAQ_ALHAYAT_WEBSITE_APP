import Image from "next/image";
import type { ReactNode } from "react";
import { CleaningScene, HeroScene, MaintenanceScene, PestControlScene } from "./brand-scenes";

type BrandCategory = "maintenance" | "cleaning" | "pest-control";

type BrandPanelProps = {
  icon: ReactNode;
  variant?: "hero" | "card";
  category?: BrandCategory;
  src?: string;
  alt?: string;
  className?: string;
};

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
 * real photo later: add a file at
 * /public/images/brand/hero-afaq-alhayat-dubai.jpg (hero) or
 * /public/images/brand/services/<service-id>-afaq-alhayat-dubai.jpg
 * (service cards) and pass it as `src` — the illustration is replaced
 * automatically, no markup changes.
 */
export function BrandPanel({
  icon,
  variant = "card",
  category,
  src,
  alt = "",
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
          alt={alt}
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
