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
  CameraIcon,
  CleaningIcon,
  DecorationIcon,
  DropletIcon,
  ElectricalIcon,
  HandymanIcon,
  InterlockIcon,
  KitchenIcon,
  LightingIcon,
  PaintingIcon,
  PestIcon,
  PoolIcon,
  RooftopIcon,
  SmartHomeIcon,
  ThermalInsulationIcon,
  WallpaperInstallIcon,
  WaterproofingIcon,
  WoodAlternativeIcon,
  WrenchIcon,
} from "@/components/icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type VisualCategory = "maintenance" | "cleaning" | "pest-control";

/**
 * One specific, expressive icon per service (2026-08-07 redesign,
 * Owner-requested) rather than the earlier 6-icon set reused across all
 * 26 services (e.g. every maintenance trade sharing WrenchIcon). Reuse
 * is still fine where two services are genuinely the same kind of work
 * (the cleaning sub-types, the water/drainage trio) — the point is
 * matching Lucide's real breadth, not forcing artificial variety.
 */
export const SERVICE_ICONS: Record<string, IconComponent> = {
  "ac-maintenance": AcUnitIcon,
  plumbing: WrenchIcon,
  "electrical-maintenance": ElectricalIcon,
  painting: PaintingIcon,
  handyman: HandymanIcon,
  "general-cleaning": CleaningIcon,
  "deep-cleaning": CleaningIcon,
  "water-tank-cleaning": DropletIcon,
  "villa-cleaning": CleaningIcon,
  "office-cleaning": CleaningIcon,
  "post-construction-cleaning": CleaningIcon,
  "carpet-upholstery-cleaning": CleaningIcon,
  "pest-control": PestIcon,
  "drain-unblocking": DropletIcon,
  waterproofing: WaterproofingIcon,
  "water-leak-detection": DropletIcon,
  "cctv-installation": CameraIcon,
  "smart-home-installation": SmartHomeIcon,
  "swimming-pool-maintenance": PoolIcon,
  "kitchen-installation": KitchenIcon,
  "interior-decoration": DecorationIcon,
  "interlock-installation": InterlockIcon,
  "lighting-maintenance": LightingIcon,
  "wood-alternative-installation": WoodAlternativeIcon,
  "wallpaper-installation": WallpaperInstallIcon,
  "thermal-insulation": ThermalInsulationIcon,
  "rooftop-space-utilization": RooftopIcon,
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
