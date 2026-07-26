import { afterEach, describe, expect, it } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConsentBanner } from "./consent-banner";
import { getMessages } from "@/i18n/get-messages";
import { CONSENT_COOKIE_NAME } from "@/lib/consent/cookie";

const t = getMessages("en");

function clearConsentCookie() {
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; max-age=0`;
}

describe("ConsentBanner", () => {
  afterEach(() => {
    clearConsentCookie();
  });

  it("shows the banner when no consent choice has been made yet", async () => {
    render(<ConsentBanner t={t} />);
    await waitFor(() => {
      expect(screen.getByText(t.consent.banner.message)).toBeInTheDocument();
    });
  });

  it("hides the banner and stores the choice when accepted", async () => {
    render(<ConsentBanner t={t} />);
    await waitFor(() => screen.getByRole("button", { name: t.consent.banner.accept }));

    fireEvent.click(screen.getByRole("button", { name: t.consent.banner.accept }));

    expect(screen.queryByText(t.consent.banner.message)).not.toBeInTheDocument();
    expect(document.cookie).toContain(`${CONSENT_COOKIE_NAME}=granted`);
  });

  it("hides the banner and stores the choice when declined", async () => {
    render(<ConsentBanner t={t} />);
    await waitFor(() => screen.getByRole("button", { name: t.consent.banner.decline }));

    fireEvent.click(screen.getByRole("button", { name: t.consent.banner.decline }));

    expect(screen.queryByText(t.consent.banner.message)).not.toBeInTheDocument();
    expect(document.cookie).toContain(`${CONSENT_COOKIE_NAME}=declined`);
  });

  it("does not show the banner again once a choice was already recorded", async () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=granted; path=/`;
    render(<ConsentBanner t={t} />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByText(t.consent.banner.message)).not.toBeInTheDocument();
  });
});
