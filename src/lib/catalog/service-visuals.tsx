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
  "pest-control": ShieldCheckIcon,
  "drain-unblocking": DropletIcon,
  waterproofing: DropletIcon,
  "water-leak-detection": DropletIcon,
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
  "pest-control": "pest-control",
  "drain-unblocking": "maintenance",
  waterproofing: "maintenance",
  "water-leak-detection": "maintenance",
};
