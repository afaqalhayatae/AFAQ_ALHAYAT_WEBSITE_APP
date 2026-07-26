import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { CONSENT_COOKIE_NAME } from "@/lib/consent/cookie";

function setConsentCookie(value: string) {
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/`;
}

function clearConsentCookie() {
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; max-age=0`;
}

describe("GoogleTagManager", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    clearConsentCookie();
    vi.unstubAllEnvs();
  });

  it("renders nothing when no container id is configured, even with consent granted", async () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_CONTAINER_ID", "");
    setConsentCookie("granted");

    const { GoogleTagManager } = await import("./google-tag-manager");
    const { container } = render(<GoogleTagManager />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when consent has not been granted, even with a container id configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_CONTAINER_ID", "GTM-TEST123");
    clearConsentCookie();

    const { GoogleTagManager } = await import("./google-tag-manager");
    const { container } = render(<GoogleTagManager />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(container).toBeEmptyDOMElement();
  });

  it("loads the GTM script once both a container id and granted consent are present", async () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_CONTAINER_ID", "GTM-TEST123");
    setConsentCookie("granted");

    const { GoogleTagManager } = await import("./google-tag-manager");
    render(<GoogleTagManager />);

    await waitFor(() => {
      expect(document.getElementById("gtm-loader")).not.toBeNull();
    });
  });
});
