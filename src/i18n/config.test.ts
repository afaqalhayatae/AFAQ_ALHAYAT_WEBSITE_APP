import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, localeDirection, locales } from "./config";

describe("i18n config", () => {
  it("defaults to Arabic", () => {
    expect(defaultLocale).toBe("ar");
  });

  it("maps Arabic to rtl and English to ltr", () => {
    expect(localeDirection.ar).toBe("rtl");
    expect(localeDirection.en).toBe("ltr");
  });

  it("recognizes only the supported locales", () => {
    for (const locale of locales) {
      expect(isLocale(locale)).toBe(true);
    }
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});
