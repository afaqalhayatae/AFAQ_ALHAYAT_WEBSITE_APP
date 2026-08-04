import { afterEach, describe, expect, it } from "vitest";
import { CONSENT_COOKIE_NAME, readConsentCookie, writeConsentCookie } from "./cookie";

function clearCookie() {
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; max-age=0`;
}

describe("consent cookie", () => {
  afterEach(() => {
    clearCookie();
    delete window.gtag;
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

  it("pushes a Consent Mode v2 'granted' update via window.gtag when consent is granted", () => {
    const calls: unknown[][] = [];
    window.gtag = (...args: unknown[]) => calls.push(args);

    writeConsentCookie("granted");

    expect(calls).toEqual([
      [
        "consent",
        "update",
        {
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
          analytics_storage: "granted",
        },
      ],
    ]);
  });

  it("pushes a Consent Mode v2 'denied' update via window.gtag when consent is declined", () => {
    const calls: unknown[][] = [];
    window.gtag = (...args: unknown[]) => calls.push(args);

    writeConsentCookie("declined");

    expect(calls).toEqual([
      [
        "consent",
        "update",
        {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
        },
      ],
    ]);
  });

  it("does not throw when window.gtag is not yet defined (no GTM container configured)", () => {
    expect(window.gtag).toBeUndefined();
    expect(() => writeConsentCookie("granted")).not.toThrow();
  });
});
