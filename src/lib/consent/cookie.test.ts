import { afterEach, describe, expect, it } from "vitest";
import { CONSENT_COOKIE_NAME, readConsentCookie, writeConsentCookie } from "./cookie";

function clearCookie() {
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; max-age=0`;
}

describe("consent cookie", () => {
  afterEach(() => {
    clearCookie();
  });

  it("returns null when no consent cookie is set", () => {
    expect(readConsentCookie()).toBeNull();
  });

  it("round-trips a granted choice", () => {
    writeConsentCookie("granted");
    expect(readConsentCookie()).toBe("granted");
  });

  it("round-trips a declined choice", () => {
    writeConsentCookie("declined");
    expect(readConsentCookie()).toBe("declined");
  });

  it("dispatches a change event with the chosen value", () => {
    let received: string | undefined;
    const handler = (event: Event) => {
      received = (event as CustomEvent<string>).detail;
    };
    window.addEventListener("afaq-consent-change", handler);

    writeConsentCookie("granted");

    expect(received).toBe("granted");
    window.removeEventListener("afaq-consent-change", handler);
  });
});
