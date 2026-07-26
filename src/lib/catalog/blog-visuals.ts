/**
 * Presentational-only mapping from a blog category to its BrandPanel icon
 * and visual scene bucket (JOB-AGT-WEB-20260726-M4.3) — same decoupled
 * pattern as service-visuals.tsx. "company-guides" has no service
 * counterpart, so it falls back to BrandPanel's default gradient/scene.
 */

import type { ComponentType, SVGProps } from "react";
import { CleaningIcon, DropletIcon, SparkleIcon, WrenchIcon } from "@/components/icons";
import type { BlogCategory } from "./blog";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type VisualCategory = "maintenance" | "cleaning" | "pest-control";

export const BLOG_CATEGORY_ICONS: Record<BlogCategory, IconComponent> = {
  "general-maintenance": WrenchIcon,
  "cleaning-pest-control": CleaningIcon,
  "drainage-water-protection": DropletIcon,
  "company-guides": SparkleIcon,
};

export const BLOG_CATEGORY_VISUAL: Partial<Record<BlogCategory, VisualCategory>> = {
  "general-maintenance": "maintenance",
  "cleaning-pest-control": "cleaning",
  "drainage-water-protection": "maintenance",
};
