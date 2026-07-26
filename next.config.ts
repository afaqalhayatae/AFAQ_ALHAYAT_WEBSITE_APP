import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
