import type { MetadataRoute } from "next";
import { COMPANY_NAME } from "@/lib/brand/links";

/**
 * PWA/"Add to Home Screen" manifest (Phase 1 identity readiness pass).
 * Icons are resized from the same approved brand mark already used in
 * the header (`public/brand/logo-mark.png`) — no new artwork.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY_NAME,
    short_name: COMPANY_NAME,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f4c81",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
