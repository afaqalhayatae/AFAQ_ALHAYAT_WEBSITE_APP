/**
 * Presentational-only mapping from a service slug to its BrandPanel icon
 * and visual scene bucket (JOB-AGT-WEB-20260726-M4.1). Decoupled from the
 * canonical business category in services.ts on purpose — BrandPanel's
 * scene illustrations (brand-scenes.tsx) predate the 12-service catalog
 * and only cover three visual buckets; new illustrations per canonical
 * category are a future visual-design pass, not part of this routing
 * phase. The bucket here only selects decorative art, never displayed
 * text — the actual category label always comes from services.categories.
 */

import type { ComponentType, SVGProps } from "react";
import {
  AcUnitIcon,
  CleaningIcon,
  DropletIcon,
  HomeIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "@/components/icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type VisualCategory = "maintenance" | "cleaning" | "pest-control";

export const SERVICE_ICONS: Record<string, IconComponent> = {
  "ac-maintenance": AcUnitIcon,
  plumbing: WrenchIcon,
  "electrical-maintenance": WrenchIcon,
  painting: WrenchIcon,
  handyman: WrenchIcon,
  "general-cleaning": CleaningIcon,
  "deep-cleaning": CleaningIcon,
  "water-tank-cleaning": DropletIcon,
  "villa-cleaning": CleaningIcon,
  "office-cleaning": CleaningIcon,
  "post-construction-cleaning": CleaningIcon,
  "carpet-upholstery-cleaning": CleaningIcon,
  "pest-control": ShieldCheckIcon,
  "drain-unblocking": DropletIcon,
  waterproofing: DropletIcon,
  "water-leak-detection": DropletIcon,
  "cctv-installation": WrenchIcon,
  "smart-home-installation": WrenchIcon,
  "swimming-pool-maintenance": DropletIcon,
  "kitchen-installation": HomeIcon,
  "interior-decoration": HomeIcon,
  "interlock-installation": WrenchIcon,
  "lighting-maintenance": WrenchIcon,
  "wood-alternative-installation": WrenchIcon,
  "wallpaper-installation": WrenchIcon,
  "thermal-insulation": WrenchIcon,
  "rooftop-space-utilization": HomeIcon,
};

export const SERVICE_VISUAL_CATEGORY: Record<string, VisualCategory> = {
  "ac-maintenance": "maintenance",
  plumbing: "maintenance",
  "electrical-maintenance": "maintenance",
  painting: "maintenance",
  handyman: "maintenance",
  "general-cleaning": "cleaning",
  "deep-cleaning": "cleaning",
  "water-tank-cleaning": "maintenance",
  "villa-cleaning": "cleaning",
  "office-cleaning": "cleaning",
  "post-construction-cleaning": "cleaning",
  "carpet-upholstery-cleaning": "cleaning",
  "pest-control": "pest-control",
  "drain-unblocking": "maintenance",
  waterproofing: "maintenance",
  "water-leak-detection": "maintenance",
  "cctv-installation": "maintenance",
  "smart-home-installation": "maintenance",
  "swimming-pool-maintenance": "maintenance",
  "kitchen-installation": "maintenance",
  "interior-decoration": "maintenance",
  "interlock-installation": "maintenance",
  "lighting-maintenance": "maintenance",
  "wood-alternative-installation": "maintenance",
  "wallpaper-installation": "maintenance",
  "thermal-insulation": "maintenance",
  "rooftop-space-utilization": "maintenance",
};

/**
 * Solid icon-badge background per category (Master Design Reference
 * Implementation) — matches the approved reference's two-tone system:
 * blue for Maintenance and Pest Control, green for Cleaning. Both are
 * already-approved tokens (`COLORS.md` Primary Blue / Success Green),
 * not new colors.
 */
export const CATEGORY_BADGE_COLOR: Record<VisualCategory, string> = {
  maintenance: "bg-(--color-primary)",
  cleaning: "bg-(--color-success)",
  "pest-control": "bg-(--color-primary)",
};
