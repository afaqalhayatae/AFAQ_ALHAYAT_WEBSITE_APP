import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";
import { getMessages } from "@/i18n/get-messages";

describe("Footer", () => {
  it("renders the tagline and locale-prefixed quick links", () => {
    const t = getMessages("en");
    render(<Footer locale="en" t={t} />);

    expect(screen.getByText(t.footer.tagline)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.nav.services })).toHaveAttribute(
      "href",
      "/en/services"
    );
    expect(screen.getByRole("link", { name: t.nav.locations })).toHaveAttribute(
      "href",
      "/en/locations"
    );
  });

  it("shows contact details sourced from the shared contact info messages", () => {
    const t = getMessages("en");
    render(<Footer locale="en" t={t} />);

    expect(screen.getByText(t.contact.info.email)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.footer.viewOnMap })).toHaveAttribute(
      "href",
      "https://maps.app.goo.gl/jeLNXvJB9fV8JxPG7"
    );
    expect(screen.getByText(t.footer.address)).toBeInTheDocument();
  });

  it("renders the canonical WhatsApp link and social links", () => {
    const t = getMessages("en");
    render(<Footer locale="en" t={t} />);

    expect(screen.getByRole("link", { name: t.common.whatsappCta })).toHaveAttribute(
      "href",
      "https://wa.me/message/JMZVJDFDQL3VD1"
    );
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/afaq_alhayat"
    );
  });

  it("renders locale-prefixed legal links in the bottom bar", () => {
    const t = getMessages("en");
    render(<Footer locale="en" t={t} />);

    expect(screen.getByRole("link", { name: t.legal.links.privacy })).toHaveAttribute(
      "href",
      "/en/privacy-policy"
    );
    expect(screen.getByRole("link", { name: t.legal.links.terms })).toHaveAttribute(
      "href",
      "/en/terms-and-conditions"
    );
    expect(screen.getByRole("link", { name: t.legal.links.cookies })).toHaveAttribute(
      "href",
      "/en/cookie-policy"
    );
  });
});
