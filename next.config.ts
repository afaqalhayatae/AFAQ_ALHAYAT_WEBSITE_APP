import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pins the workspace root to this project directory. Without this, Next
  // walks up from cwd looking for lockfiles and — in this environment —
  // finds an unrelated one at the home-directory root, which it then
  // (wrongly) infers as the monorepo root. That produced the "multiple
  // lockfiles" warning on every single dev/build run and, once, contributed
  // to a corrupted Turbopack dev-cache state (2026-08-02 production launch
  // preparation pass). Setting this explicitly removes the ambiguity for
  // both file-tracing (build/start) and Turbopack (dev).
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Serve AVIF first with WebP fallback for every next/image usage —
    // JOB-AGT-WEB-20260726-M4.5 image optimization.
    formats: ["image/avif", "image/webp"],
    // Allows the local, self-authored temporary demo placeholder SVG
    // (public/brand/images/demo/) to render via next/image. Remove this
    // if no SVG asset is ever needed once real (raster) photography
    // replaces it.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
