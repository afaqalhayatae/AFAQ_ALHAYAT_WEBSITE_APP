import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceLocationPage, { generateStaticParams } from "./page";
import { getMessages } from "@/i18n/get-messages";
import { SERVICES } from "@/lib/catalog/services";
import { LOCATIONS } from "@/lib/catalog/locations";

describe("ServiceLocationPage", () => {
  it("generates a static param for every service x registered location except Pest Control", () => {
    const params = generateStaticParams();
    // Pest Control is deliberately excluded (Canonical URL Architecture
    // Finalization, JOB-AGT-WEB-20260730): the explicit
    // /services/pest-control/ folder shadows this generic [slug] route
    // at the routing level, so a static param for it here would never
    // actually be reachable — that combo is handled inside
    // services/pest-control/[subService]/page.tsx instead.
    expect(params).toHaveLength((SERVICES.length - 1) * LOCATIONS.length);
    expect(params).not.toContainEqual({ slug: "pest-control", location: "dubai" });
    expect(params).toContainEqual({ slug: "ac-maintenance", location: "dubai" });
    expect(params).toContainEqual({ slug: "ac-maintenance", location: "abu-dhabi" });
  });

  it("renders the service name and Dubai in the heading, plus both CTAs, for a combo with no canonical city page yet", async () => {
    // ac-maintenance/dubai and plumbing/dubai now both redirect (real
    // content was added for both — see the redirect test below), so this
    // uses painting/dubai, which still has no CITY_SERVICE_CONTENT entry
    // and keeps rendering the legacy fallback unchanged.
    const element = await ServiceLocationPage({
      params: Promise.resolve({ locale: "en", slug: "painting", location: "dubai" }),
    });
    render(element);

    const t = getMessages("en");
    const entry = t.services.entries["painting"];
    expect(
      screen.getByRole("heading", { level: 1, name: `${entry.name} in Dubai` })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: t.common.requestService })).toHaveAttribute(
      "href",
      "/en/book"
    );
    expect(screen.getByRole("link", { name: t.locations.combo.backToService })).toHaveAttribute(
      "href",
      "/en/services/painting"
    );
    expect(screen.getByRole("link", { name: t.locations.combo.backToLocation })).toHaveAttribute(
      "href",
      "/en/locations/dubai"
    );
  });

  it("308-redirects to the canonical city page now that plumbing/dubai has real content (2026-08-03 local-SEO expansion pass)", async () => {
    await expect(
      ServiceLocationPage({
        params: Promise.resolve({ locale: "en", slug: "plumbing", location: "dubai" }),
      })
    ).rejects.toThrow();
  });

  it("308-redirects to the canonical city page now that ac-maintenance/dubai has real content (2026-08-02 content-integration pass)", async () => {
    await expect(
      ServiceLocationPage({
        params: Promise.resolve({ locale: "en", slug: "ac-maintenance", location: "dubai" }),
      })
    ).rejects.toThrow();
  });

  it("404s for Pest Control — shadowed by the explicit /services/pest-control/ route", async () => {
    await expect(
      ServiceLocationPage({
        params: Promise.resolve({ locale: "en", slug: "pest-control", location: "dubai" }),
      })
    ).rejects.toThrow();
  });

  it("404s for a location outside the approved registry", async () => {
    await expect(
      ServiceLocationPage({
        params: Promise.resolve({ locale: "en", slug: "ac-maintenance", location: "riyadh" }),
      })
    ).rejects.toThrow();
  });

  it("404s for an unknown service slug", async () => {
    await expect(
      ServiceLocationPage({
        params: Promise.resolve({ locale: "en", slug: "not-a-service", location: "dubai" }),
      })
    ).rejects.toThrow();
  });
});
