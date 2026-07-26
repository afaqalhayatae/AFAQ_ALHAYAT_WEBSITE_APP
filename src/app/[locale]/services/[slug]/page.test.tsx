import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceDetailPage, { generateStaticParams } from "./page";
import { getMessages } from "@/i18n/get-messages";
import { SERVICES } from "@/lib/catalog/services";

describe("ServiceDetailPage", () => {
  it("generates a static param for every canonical service", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(SERVICES.length);
    expect(params).toContainEqual({ slug: "general-cleaning" });
  });

  it("renders the service name, category, and CTAs", async () => {
    const element = await ServiceDetailPage({
      params: Promise.resolve({ locale: "en", slug: "general-cleaning" }),
    });
    render(element);

    const t = getMessages("en");
    const entry = t.services.entries["general-cleaning"];
    expect(screen.getByRole("heading", { level: 1, name: entry.name })).toBeInTheDocument();
    expect(
      screen.getByText(t.services.categories["cleaning-pest-control"])
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: t.common.requestService })).toHaveAttribute(
      "href",
      "/en/contact"
    );
    expect(screen.getAllByRole("link", { name: t.common.whatsappCta })[0]).toHaveAttribute(
      "href",
      "https://wa.me/message/JMZVJDFDQL3VD1"
    );
    expect(screen.getByRole("link", { name: t.services.detail.viewInDubai })).toHaveAttribute(
      "href",
      "/en/services/general-cleaning/dubai"
    );
  });

  it("lists related services from the same category", async () => {
    const element = await ServiceDetailPage({
      params: Promise.resolve({ locale: "en", slug: "general-cleaning" }),
    });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { name: t.services.detail.relatedTitle })
    ).toBeInTheDocument();
    // Pest Control shares the "Cleaning & Pest Control" category. The
    // card's accessible name includes its description text too, so match
    // by substring rather than exact equality.
    expect(
      screen.getByRole("link", { name: new RegExp(t.services.entries["pest-control"].name) })
    ).toBeInTheDocument();
  });

  it("shows the how-it-works conversion section and closing CTA band", async () => {
    const element = await ServiceDetailPage({
      params: Promise.resolve({ locale: "en", slug: "general-cleaning" }),
    });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { name: t.services.detail.howItWorksTitle })
    ).toBeInTheDocument();
    for (const step of t.home.howItWorks.steps) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: t.home.cta.title })).toBeInTheDocument();
  });

  it("does not render expanded content or FAQ sections while no approved copy exists", async () => {
    const element = await ServiceDetailPage({
      params: Promise.resolve({ locale: "en", slug: "general-cleaning" }),
    });
    render(element);

    const t = getMessages("en");
    expect(screen.queryByText(t.services.detail.includedTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(t.services.detail.benefitsTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(t.services.detail.faqTitle)).not.toBeInTheDocument();
  });

  it("404s for an unknown service slug", async () => {
    await expect(
      ServiceDetailPage({ params: Promise.resolve({ locale: "en", slug: "not-a-service" }) })
    ).rejects.toThrow();
  });

  it("404s for an unsupported locale", async () => {
    await expect(
      ServiceDetailPage({ params: Promise.resolve({ locale: "fr", slug: "general-cleaning" }) })
    ).rejects.toThrow();
  });
});
