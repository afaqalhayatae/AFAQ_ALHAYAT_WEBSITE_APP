import Link from "next/link";
import type { UnifiedHeroBreadcrumbItem } from "./unified-hero";
import { CleaningScene, HeroScene, MaintenanceScene, PestControlScene } from "./brand-scenes";

type SceneKey = "hero" | "maintenance" | "cleaning" | "pest-control";

const SCENES: Record<SceneKey, typeof HeroScene> = {
  hero: HeroScene,
  maintenance: MaintenanceScene,
  cleaning: CleaningScene,
  "pest-control": PestControlScene,
};

/**
 * Full-bleed illustrated hero band (Premium Identity Pass, 2026-08-05) —
 * the UnifiedHero-equivalent for pages with no real, approved photograph
 * yet (About, Contact, FAQ, the Maintenance section hub, Locations
 * index). Same brand gradient + dot-grid + blur-orb + line-art scene
 * language BrandPanel already uses for its illustration fallback, just
 * scaled to a full-width banner instead of a 4:3 card — this doesn't
 * invent a new visual language, it gives pages without real photography
 * yet the same premium presence UnifiedHero gives pages that have one.
 * Swap to `UnifiedHero` once a real approved photo exists for the page —
 * same migration path BrandPanel's own doc comment already describes.
 */
export function IllustratedHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  currentPageLabel,
  scene = "hero",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: UnifiedHeroBreadcrumbItem[];
  currentPageLabel?: string;
  scene?: SceneKey;
}) {
  const Scene = SCENES[scene];

  return (
    <>
      {breadcrumb && breadcrumb.length > 0 ? (
        <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
          {breadcrumb.map((crumb) => (
            <span key={crumb.href}>
              <Link href={crumb.href} className="hover:text-(--color-primary)">
                {crumb.label}
              </Link>
              <span className="mx-space-1">/</span>
            </span>
          ))}
          {currentPageLabel ? <span>{currentPageLabel}</span> : null}
        </section>
      ) : null}

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-(--color-primary) to-[#0a2f52]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -end-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -start-16 -bottom-24 h-64 w-64 rounded-full bg-white/5 blur-3xl"
        />
        <div className="pointer-events-none absolute inset-0 opacity-45">
          <Scene data-testid="brand-scene" />
        </div>

        <div className="relative z-10 mx-auto max-w-desktop px-space-3 py-space-7 tablet:py-space-8">
          <div className="hero-fade-up max-w-2xl text-start">
            {eyebrow ? (
              <p className="text-small font-semibold uppercase tracking-wide text-white/90">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-space-2 text-h1 font-bold leading-[1.05] text-white">{title}</h1>
            {description ? (
              <p className="mt-space-3 max-w-2xl text-lead text-white/85">{description}</p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
