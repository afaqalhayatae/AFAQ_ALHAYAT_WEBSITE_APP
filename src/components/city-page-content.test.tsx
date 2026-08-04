import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CityPageContent } from "./city-page-content";
import type { CityContentBlock } from "@/lib/catalog/city-content";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

/**
 * TEST FIXTURE ONLY — not real, Owner-approved city content. Used purely
 * to prove the render pipeline (breadcrumbs, phone/CTA wiring, JSON-LD,
 * related-links gating, FAQ/image gating) works correctly once real copy
 * is added to CITY_SERVICE_CONTENT / CITY_SECTION_CONTENT.
 */
const FIXTURE_CONTENT: CityContentBlock = {
  title: { en: "AC Maintenance in Dubai", ar: "صيانة مكيفات في دبي" },
  h1: { en: "AC Maintenance in Dubai", ar: "صيانة مكيفات في دبي" },
  metaDescription: { en: "Test description.", ar: "وصف تجريبي." },
  intro: { en: "Test intro paragraph.", ar: "فقرة تجريبية." },
  body: [{ en: "Test body paragraph one.", ar: "فقرة تجريبية أولى." }],
  status: "TEST FIXTURE — not real approved content",
};

const BASE_PROPS = {
  locale: "en" as const,
  breadcrumbs: [{ label: "Services", href: "/en/services" }],
  content: FIXTURE_CONTENT,
  cityName: "Dubai",
  contactHref: "/en/book?service=ac-maintenance&location=dubai",
  locationHref: "/en/locations/dubai",
  category: "maintenance" as const,
  relatedTitle: "Other services in Dubai",
  relatedLinks: [],
  faqTitle: "Frequently asked questions",
  canonicalPath: "services/maintenance/ac-maintenance/dubai",
};

describe("CityPageContent", () => {
  it("renders the H1, intro, body, and city name from the given content block", () => {
    render(<CityPageContent {...BASE_PROPS} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "AC Maintenance in Dubai" })
    ).toBeInTheDocument();
    expect(screen.getByText("Test intro paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Test body paragraph one.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/en/services");
  });

  it("links the trailing city breadcrumb back to the emirate hub page (SEO_CONTENT_QUALITY_AUDIT.md §3 fix)", () => {
    render(<CityPageContent {...BASE_PROPS} />);
    expect(screen.getByRole("link", { name: "Dubai" })).toHaveAttribute(
      "href",
      "/en/locations/dubai"
    );
  });

  it("wires the phone, WhatsApp, and Request Service CTAs to real working contact paths (Final Production Cleanup Rule — no non-functional booking flow)", () => {
    render(<CityPageContent {...BASE_PROPS} />);

    expect(screen.getAllByRole("link", { name: "Request Service" })[0]).toHaveAttribute(
      "href",
      "/en/book?service=ac-maintenance&location=dubai"
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

  it("embeds a Service (not LocalBusiness) JSON-LD schema naming the page and area (SEO_CONTENT_QUALITY_AUDIT.md §6 fix)", () => {
    const { container } = render(<CityPageContent {...BASE_PROPS} />);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const schemas = Array.from(scripts).map((script) => JSON.parse(script.innerHTML));
    const serviceSchema = schemas.find((schema) => schema["@type"] === "Service");

    expect(serviceSchema).toBeDefined();
    expect(serviceSchema.name).toBe("AC Maintenance in Dubai");
    expect(serviceSchema.areaServed).toBe("Dubai");
    expect(schemas.some((schema) => schema["@type"] === "LocalBusiness")).toBe(false);
  });

  it("only shows the related-services section when there is at least one real link", () => {
    const { rerender } = render(<CityPageContent {...BASE_PROPS} relatedLinks={[]} />);
    expect(screen.queryByText("Other services in Dubai")).not.toBeInTheDocument();

    rerender(
      <CityPageContent
        {...BASE_PROPS}
        relatedLinks={[{ name: "Plumbing in Dubai", href: "/en/services/maintenance/plumbing/dubai" }]}
      />
    );
    expect(screen.getByText("Other services in Dubai")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Plumbing in Dubai" })).toHaveAttribute(
      "href",
      "/en/services/maintenance/plumbing/dubai"
    );
  });

  it("renders no FAQ section and no illustration fallback image when content.faqs/image are unset (today's real state for all 57 pages)", () => {
    render(<CityPageContent {...BASE_PROPS} />);
    expect(screen.queryByText("Frequently asked questions")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the FAQ section with FAQPage schema only when content.faqs has real entries (SEO_CONTENT_QUALITY_AUDIT.md §2 structure)", () => {
    const contentWithFaqs: CityContentBlock = {
      ...FIXTURE_CONTENT,
      faqs: [
        {
          id: "test-faq-1",
          category: "locations",
          question: { en: "Test question?", ar: "سؤال تجريبي؟" },
          answer: { en: "Test answer.", ar: "إجابة تجريبية." },
        },
      ],
    };
    const { container } = render(<CityPageContent {...BASE_PROPS} content={contentWithFaqs} />);

    expect(screen.getByText("Frequently asked questions")).toBeInTheDocument();
    expect(screen.getByText("Test question?")).toBeInTheDocument();
    expect(screen.getByText("Test answer.")).toBeInTheDocument();

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const schemas = Array.from(scripts).map((script) => JSON.parse(script.innerHTML));
    expect(schemas.some((schema) => schema["@type"] === "FAQPage")).toBe(true);
  });

  it("renders the real photo with its alt text when content.image/imageAlt are set", () => {
    const contentWithImage: CityContentBlock = {
      ...FIXTURE_CONTENT,
      image: "ac-maintenance/ac-maintenance-card-v1.webp",
      imageAlt: { en: "Technician servicing an AC unit in Dubai", ar: "فني يصون مكيفًا في دبي" },
    };
    render(<CityPageContent {...BASE_PROPS} content={contentWithImage} />);

    expect(
      screen.getByRole("img", { name: "Technician servicing an AC unit in Dubai" })
    ).toBeInTheDocument();
  });
});
