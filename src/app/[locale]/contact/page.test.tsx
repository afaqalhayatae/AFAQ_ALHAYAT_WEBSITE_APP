import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactPage from "./page";
import { getMessages } from "@/i18n/get-messages";

describe("ContactPage", () => {
  it("renders the enquiry form alongside the contact info", async () => {
    const element = await ContactPage({ params: Promise.resolve({ locale: "en" }) });
    render(element);

    const t = getMessages("en");
    expect(screen.getByRole("heading", { level: 1, name: t.contact.hero.title })).toBeInTheDocument();
    expect(screen.getByLabelText(t.contact.form.nameLabel)).toBeInTheDocument();
    expect(screen.getByText(t.contact.info.email)).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      ContactPage({ params: Promise.resolve({ locale: "fr" }) })
    ).rejects.toThrow();
  });
});
