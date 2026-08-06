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
  /**
   * Baseline security headers (Production Readiness pass, 2026-08-04).
   * Deliberately conservative — only headers with zero risk of breaking
   * existing functionality (GTM's inline loader script, the many inline
   * `<script type="application/ld+json">` schema blocks throughout this
   * codebase, next/font, next/image). A real Content-Security-Policy is
   * NOT added here: this codebase relies on inline scripts in enough
   * places (schema markup, GTM, Consent Mode) that a strict CSP needs a
   * nonce-based architecture threaded through every page that renders
   * one — a bigger, riskier change than this pass should make blind,
   * without a way to verify it live before shipping. Flagged as a
   * separate, dedicated follow-up rather than attempted here.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevents this site from being framed by another origin
          // (clickjacking protection) — this app has no legitimate
          // reason to be embedded in an iframe elsewhere.
          { key: "X-Frame-Options", value: "DENY" },
          // Stops browsers from MIME-sniffing a response away from its
          // declared Content-Type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Sends full referrer only to same-origin requests, and only
          // the origin (not the full path) cross-origin — balances
          // analytics usefulness against leaking full URLs (which can
          // contain no PII here, but this is still the safer default).
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Explicitly denies browser features this site never uses —
          // reduces attack surface without affecting anything the site
          // actually does. geolocation=(self) allows the chat widget's
          // "share my location" action (2026-08-06); camera/microphone
          // stay denied since nothing here uses them.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
        ],
      },
      /**
       * HTML-shell cache override (2026-08-06 — real production bug found
       * live: afaqalhayatae.com's HTML pages were being served by
       * Hostinger's CDN with `s-maxage=31536000` (one year), and the CDN
       * does not purge on deploy. After enough same-day deploys, a
       * visitor's year-cached HTML referenced a `_next/static/chunks/*.css`
       * file a newer build had already replaced — a 404 on that file left
       * the page completely unstyled (confirmed live: nav items rendered
       * with zero gap between them, giant unstyled icons).
       *
       * This rule matches every path, including `/_next/static/*` — but
       * that's corrected by the more specific rule below, which Next.js
       * applies after this one for the same path and therefore wins for
       * the `Cache-Control` key. Static chunk filenames are content-
       * hashed (a new build never reuses an old one's name), so they stay
       * safe to cache forever — only the page HTML itself needs to stop
       * being cached for a year at a hop this app doesn't control the
       * purging of.
       */
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
