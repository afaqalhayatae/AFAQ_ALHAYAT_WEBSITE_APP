import { describe, expect, it } from "vitest";
import { detectAndRememberLocale } from "./locale-store";

describe("detectAndRememberLocale", () => {
  it("detects Arabic script", () => {
    expect(detectAndRememberLocale("wa-ar-1", "عايز صيانة تكييف")).toBe("ar");
  });

  it("detects Latin script", () => {
    expect(detectAndRememberLocale("wa-en-1", "I need AC repair")).toBe("en");
  });

  it("falls back to the sender's last detected language for a digits-only reply", () => {
    const waId = "wa-fallback-1";
    expect(detectAndRememberLocale(waId, "I need AC repair")).toBe("en");
    expect(detectAndRememberLocale(waId, "1")).toBe("en");
  });

  it("defaults to Arabic for a first message with no detectable script", () => {
    expect(detectAndRememberLocale("wa-new-1", "1")).toBe("ar");
  });
});
