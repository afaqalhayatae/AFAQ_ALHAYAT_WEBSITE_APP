/**
 * TEMPORARY visual QA assets (JOB-AGT-WEB-20260726-M4.5 — review only).
 * This is NOT real company photography — it's a clearly-labeled
 * placeholder image (public/brand/images/demo/demo-placeholder.svg, with
 * "DEMO PLACEHOLDER — NOT REAL COMPANY MEDIA" baked into the graphic
 * itself) used to preview how a real photo will sit in the Hero/Service/
 * Location/Blog `BrandPanel` slots before real photography exists.
 *
 * `SHOW_DEMO_VISUALS` is the single switch: flip it to `false` (or
 * delete this file and its call sites) to fall back to the normal
 * illustration placeholders once this round of visual review is done —
 * no other code changes needed. `BrandPanel`'s alt-required-with-src
 * typing (see brand-panel.tsx) guarantees any leftover usage still has
 * to carry real alt text.
 */
export const SHOW_DEMO_VISUALS = false;

export const DEMO_VISUAL_SRC = "/brand/images/demo/demo-placeholder.svg";

export const DEMO_VISUAL_ALT =
  "Demo placeholder image — not real company photography, for visual layout review only.";
