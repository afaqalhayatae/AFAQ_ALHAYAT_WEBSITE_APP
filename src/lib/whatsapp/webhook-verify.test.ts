import { afterEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import { verifyWhatsAppSignature } from "./webhook-verify";

describe("verifyWhatsAppSignature", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts a signature computed with the real app secret", () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "test-secret");
    const body = JSON.stringify({ hello: "world" });
    const signature = `sha256=${createHmac("sha256", "test-secret").update(body).digest("hex")}`;

    expect(verifyWhatsAppSignature(body, signature)).toBe(true);
  });

  it("rejects a signature computed with the wrong secret", () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "test-secret");
    const body = JSON.stringify({ hello: "world" });
    const signature = `sha256=${createHmac("sha256", "wrong-secret").update(body).digest("hex")}`;

    expect(verifyWhatsAppSignature(body, signature)).toBe(false);
  });

  it("rejects a signature for a body that was tampered with after signing", () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "test-secret");
    const originalBody = JSON.stringify({ hello: "world" });
    const signature = `sha256=${createHmac("sha256", "test-secret").update(originalBody).digest("hex")}`;
    const tamperedBody = JSON.stringify({ hello: "tampered" });

    expect(verifyWhatsAppSignature(tamperedBody, signature)).toBe(false);
  });

  it("rejects when no signature header is present", () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "test-secret");
    expect(verifyWhatsAppSignature("{}", null)).toBe(false);
  });

  it("rejects when WHATSAPP_APP_SECRET is unset", () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "");
    expect(verifyWhatsAppSignature("{}", "sha256=anything")).toBe(false);
  });
});
