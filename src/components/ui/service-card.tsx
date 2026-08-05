import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { BrandPanel } from "../brand-panel";
import { ArrowRightIcon } from "../icons";

type BrandCategory = "maintenance" | "cleaning" | "pest-control";

/**
 * Service listing card (UI Design System Upgrade, 2026-08-05) —
 * extracted from the identical markup independently hand-copied across
 * all 3 service listing pages (services/page.tsx, services/maintenance/
 * page.tsx, services/cleaning/page.tsx). Same structure, same classes;
 * this just names it once so a future spacing/border tweak is one edit
 * instead of three kept in sync by hand.
 */
export function ServiceCard({
  href,
  icon: Icon,
  badgeColorClass,
  imageSrc,
  imageAlt,
  imageCategory,
  imageSizes = "(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw",
  eyebrow,
  title,
  description,
  learnMoreLabel,
  requestServiceHref,
  requestServiceLabel,
  headingLevel = 3,
}: {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Tailwind background-color class for the icon badge (category-tinted). */
  badgeColorClass: string;
  imageSrc: string;
  imageAlt: string;
  imageCategory: BrandCategory;
  imageSizes?: string;
  /** Small uppercase label above the description — usually the category name. */
  eyebrow: string;
  title: string;
  description: string;
  learnMoreLabel: string;
  requestServiceHref: string;
  requestServiceLabel: string;
  /** Match whatever level is correct in the page's own heading hierarchy —
   *  3 under a category H2 (services/page.tsx's grouped grid), 2 when the
   *  card sits directly under the page's own H1 (section listing pages). */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) transition-all duration-300 ease-out hover:-translate-y-1 hover:border-(--color-primary)/30 hover:shadow-xl">
      {/* Header row: colored icon badge + title, above the photo —
          matches the approved Master Design Reference. */}
      <Link href={href} className="flex items-center gap-space-2 p-space-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-(--color-surface) transition-transform duration-300 ease-out group-hover:scale-110 ${badgeColorClass}`}
        >
          <Icon className="h-6 w-6" />
        </span>
        <Heading className="text-h5 font-semibold text-(--color-text-primary) transition-colors group-hover:text-(--color-primary)">
          {title}
        </Heading>
      </Link>
      <Link href={href}>
        <BrandPanel
          variant="card"
          category={imageCategory}
          icon={null}
          className="rounded-t-none rounded-b-none"
          src={imageSrc}
          alt={imageAlt}
          sizes={imageSizes}
        />
      </Link>
      <div className="flex flex-col gap-space-1 p-space-4">
        <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
          {eyebrow}
        </p>
        <p className="text-small text-(--color-text-secondary)">{description}</p>
        <div className="mt-space-2 flex flex-wrap items-center gap-space-3">
          <Link
            href={href}
            className="inline-flex items-center gap-space-1 text-small font-semibold text-(--color-primary)"
          >
            {learnMoreLabel}
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 ease-out rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
          <Link
            href={requestServiceHref}
            className="text-small font-semibold text-(--color-text-secondary) hover:text-(--color-primary)"
          >
            {requestServiceLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
