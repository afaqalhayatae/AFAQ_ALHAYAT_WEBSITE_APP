import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalContactLine } from "./legal-contact-line";
import { getMessages } from "@/i18n/get-messages";

describe("LegalContactLine", () => {
  it("renders the approved phone and email using the shared contact facts", () => {
    const t = getMessages("en");
    render(<LegalContactLine t={t} />);

    expect(screen.getByText(t.legal.contactLine.title)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.contact.info.phone })).toHaveAttribute(
      "href",
      "tel:+971585431766"
    );
    expect(screen.getByRole("link", { name: t.contact.info.email })).toHaveAttribute(
      "href",
      `mailto:${t.contact.info.email}`
    );
  });
});
