import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CityPageContent } from "./city-page-content";
import type { CityContentBlock } from "@/lib/catalog/city-content";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

/**
 * TEST FIXTURE ONLY — not real, Owner-approved city content. Used purely
 * to prove the render pipeline (breadcrumbs, phone/CTA wiring, JSON-LD,
 * related-links gating) works correctly once real copy is added to
 * CITY_SERVICE_CONTENT / CITY_SECTION_CONTENT.
 */
const FIXTURE_CONTENT: CityContentBlock = {
  title: { en: "AC Maintenance in Dubai", ar: "صيانة مكيفات في دبي" },
  h1: { en: "AC Maintenance in Dubai", ar: "صيانة مكيفات في دبي" },
  metaDescription: { en: "Test description.", ar: "وصف تجريبي." },
  intro: { en: "Test intro paragraph.", ar: "فقرة تجريبية." },
  body: [{ en: "Test body paragraph one.", ar: "فقرة تجريبية أولى." }],
  status: "TEST FIXTURE — not real approved content",
};

describe("CityPageContent", () => {
  it("renders the H1, intro, body, and city name from the given content block", () => {
    render(
      <CityPageContent
        locale="en"
        breadcrumbs={[{ label: "Services", href: "/en/services" }]}
        content={FIXTURE_CONTENT}
        cityName="Dubai"
        contactHref="/en/book?service=ac-maintenance"
        relatedTitle="Other services in Dubai"
        relatedLinks={[]}
        canonicalPath="services/maintenance/ac-maintenance/dubai"
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "AC Maintenance in Dubai" })
    ).toBeInTheDocument();
    expect(screen.getByText("Test intro paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Test body paragraph one.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/en/services");
    expect(screen.getByText("Dubai")).toBeInTheDocument();
  });

  it("wires the phone, WhatsApp, and Request Service CTAs to real working contact paths (Final Production Cleanup Rule — no non-functional booking flow)", () => {
    render(
      <CityPageContent
        locale="en"
        breadcrumbs={[]}
        content={FIXTURE_CONTENT}
        cityName="Dubai"
        contactHref="/en/contact"
        relatedTitle="Other services in Dubai"
        relatedLinks={[]}
        canonicalPath="services/maintenance/ac-maintenance/dubai"
      />
    );

    expect(screen.getAllByRole("link", { name: "Request Service" })[0]).toHaveAttribute(
      "href",
      "/en/contact"
    );
    expect(screen.getAllByRole("link", { name: "Call Now" })[0]).toHaveAttribute(
      "href",
      `tel:${PHONE_E164}`
    );
    expect(screen.getAllByRole("link", { name: /Chat on WhatsApp/ })[0]).toHaveAttribute(
      "href",
      WHATSAPP_URL
    );
  });

  it("embeds a LocalBusiness JSON-LD schema naming the page and city", () => {
    const { container } = render(
      <CityPageContent
        locale="en"
        breadcrumbs={[]}
        content={FIXTURE_CONTENT}
        cityName="Dubai"
        contactHref="/en/book?service=ac-maintenance"
        relatedTitle="Other services in Dubai"
        relatedLinks={[]}
        canonicalPath="services/maintenance/ac-maintenance/dubai"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const schema = JSON.parse(script?.innerHTML ?? "{}");
    expect(schema["@type"]).toBe("LocalBusiness");
    expect(schema.name).toBe("AC Maintenance in Dubai");
    expect(schema.areaServed).toBe("Dubai");
  });

  it("only shows the related-services section when there is at least one real link", () => {
    const { rerender } = render(
      <CityPageContent
        locale="en"
        breadcrumbs={[]}
        content={FIXTURE_CONTENT}
        cityName="Dubai"
        contactHref="/en/book?service=ac-maintenance"
        relatedTitle="Other services in Dubai"
        relatedLinks={[]}
        canonicalPath="services/maintenance/ac-maintenance/dubai"
      />
    );
    expect(screen.queryByText("Other services in Dubai")).not.toBeInTheDocument();

    rerender(
      <CityPageContent
        locale="en"
        breadcrumbs={[]}
        content={FIXTURE_CONTENT}
        cityName="Dubai"
        contactHref="/en/book?service=ac-maintenance"
        relatedTitle="Other services in Dubai"
        relatedLinks={[{ name: "Plumbing in Dubai", href: "/en/services/maintenance/plumbing/dubai" }]}
        canonicalPath="services/maintenance/ac-maintenance/dubai"
      />
    );
    expect(screen.getByText("Other services in Dubai")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Plumbing in Dubai" })).toHaveAttribute(
      "href",
      "/en/services/maintenance/plumbing/dubai"
    );
  });
});
