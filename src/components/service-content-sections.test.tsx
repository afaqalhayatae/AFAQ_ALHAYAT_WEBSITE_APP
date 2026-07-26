import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ServiceBenefitsSection,
  ServiceFaqSection,
  ServiceOverviewSection,
  ServiceScopeSection,
} from "./service-content-sections";
import type { FaqItem } from "@/lib/catalog/faq";

describe("Service content section framework", () => {
  it("ServiceOverviewSection renders the given overview text", () => {
    render(<ServiceOverviewSection overview="Sample overview." />);
    expect(screen.getByText("Sample overview.")).toBeInTheDocument();
  });

  it("ServiceScopeSection renders included and excluded lists under their titles", () => {
    render(
      <ServiceScopeSection
        scope={{ included: ["Task A"], excluded: ["Task B"] }}
        includedTitle="Included"
        excludedTitle="Excluded"
      />
    );
    expect(screen.getByRole("heading", { name: "Included" })).toBeInTheDocument();
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Excluded" })).toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });

  it("ServiceBenefitsSection renders each benefit", () => {
    render(<ServiceBenefitsSection title="Benefits" items={["Benefit one", "Benefit two"]} />);
    expect(screen.getByText("Benefit one")).toBeInTheDocument();
    expect(screen.getByText("Benefit two")).toBeInTheDocument();
  });

  describe("ServiceFaqSection", () => {
    const sample: FaqItem[] = [
      {
        id: "sample-1",
        category: "services",
        serviceSlug: "general-cleaning",
        question: { en: "Sample question?", ar: "سؤال تجريبي؟" },
        answer: { en: "Sample answer.", ar: "إجابة تجريبية." },
      },
    ];

    it("renders nothing when there are no approved items", () => {
      const { container } = render(
        <ServiceFaqSection title="FAQ" items={[]} locale="en" />
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("renders the Q&A and FAQPage schema when items are approved", () => {
      render(<ServiceFaqSection title="FAQ" items={sample} locale="en" />);
      expect(screen.getByRole("heading", { name: "FAQ" })).toBeInTheDocument();
      expect(screen.getByText("Sample question?")).toBeInTheDocument();
      expect(screen.getByText("Sample answer.")).toBeInTheDocument();

      const schema = document.querySelector('script[type="application/ld+json"]');
      expect(schema).not.toBeNull();
      const parsed = JSON.parse(schema?.innerHTML ?? "{}");
      expect(parsed["@type"]).toBe("FAQPage");
      expect(parsed.mainEntity[0].name).toBe("Sample question?");
    });
  });
});
