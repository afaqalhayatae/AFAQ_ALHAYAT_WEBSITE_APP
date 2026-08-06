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
    ];
  },
};

export default nextConfig;
