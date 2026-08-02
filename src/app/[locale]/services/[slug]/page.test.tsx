import { describe, expect, it } from "vitest";
import LegacyServiceSlugRedirect, { generateStaticParams } from "./page";
import { SERVICES } from "@/lib/catalog/services";

/**
 * This route no longer renders a service page directly (2026-07-30
 * structure phase) — it redirects old flat /services/[slug] links to
 * their new category-scoped URL. Full rendering coverage for the actual
 * detail-page content lives in src/components/service-detail-content.test.tsx.
 *
 * Next's redirect() throws an error whose `.message` is just
 * "NEXT_REDIRECT" — the actual destination lives on the error's
 * `.digest` property (format: "NEXT_REDIRECT;<type>;<url>;<status>"),
 * so assertions below inspect that instead of the thrown message.
 */

async function captureRedirectDigest(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
  } catch (error) {
    return (error as { digest?: string }).digest ?? "";
  }
  throw new Error("expected a redirect to be thrown");
}

describe("LegacyServiceSlugRedirect", () => {
  it("generates a static param for every canonical service", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(SERVICES.length);
    expect(params).toContainEqual({ slug: "general-cleaning" });
  });

  it("redirects a maintenance-section service to its new nested URL", async () => {
    const digest = await captureRedirectDigest(
      LegacyServiceSlugRedirect({
        params: Promise.resolve({ locale: "en", slug: "ac-maintenance" }),
      })
    );
    expect(digest).toContain("/en/services/maintenance/ac-maintenance");
  });

  it("redirects a cleaning-section service to its new nested URL", async () => {
    const digest = await captureRedirectDigest(
      LegacyServiceSlugRedirect({
        params: Promise.resolve({ locale: "en", slug: "general-cleaning" }),
      })
    );
    expect(digest).toContain("/en/services/cleaning/general-cleaning");
  });

  it("redirects pest control to its own hub URL, not nested under a category", async () => {
    const digest = await captureRedirectDigest(
      LegacyServiceSlugRedirect({
        params: Promise.resolve({ locale: "en", slug: "pest-control" }),
      })
    );
    expect(digest).toContain("/en/services/pest-control");
    expect(digest).not.toContain("/en/services/pest-control/pest-control");
  });

  it("404s for an unknown service slug", async () => {
    await expect(
      LegacyServiceSlugRedirect({ params: Promise.resolve({ locale: "en", slug: "not-a-service" }) })
    ).rejects.toThrow();
  });

  it("404s for an unsupported locale", async () => {
    await expect(
      LegacyServiceSlugRedirect({
        params: Promise.resolve({ locale: "fr", slug: "general-cleaning" }),
      })
    ).rejects.toThrow();
  });
});
