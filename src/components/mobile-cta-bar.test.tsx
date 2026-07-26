import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MobileCtaBar } from "./mobile-cta-bar";
import { getMessages } from "@/i18n/get-messages";

describe("MobileCtaBar", () => {
  it("renders WhatsApp, phone, and Request Service actions with correct hrefs", () => {
    const t = getMessages("en");
    render(<MobileCtaBar locale="en" t={t} />);

    const whatsapp = screen.getByRole("link", { name: t.common.whatsappCta });
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/message/JMZVJDFDQL3VD1");
    expect(whatsapp).toHaveAttribute("target", "_blank");

    expect(screen.getByRole("link", { name: t.common.phone })).toHaveAttribute(
      "href",
      "tel:+971585431766"
    );

    expect(screen.getByRole("link", { name: t.common.requestService })).toHaveAttribute(
      "href",
      "/en/contact"
    );
  });
});
