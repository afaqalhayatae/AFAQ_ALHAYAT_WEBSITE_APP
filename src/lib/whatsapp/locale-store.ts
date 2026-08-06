/**
 * Remembers which language (ar/en) each WhatsApp customer is writing in.
 * The website knows its current locale from the URL (/en or /ar); a
 * WhatsApp conversation has no such signal, so it's detected from the
 * customer's own message script and remembered per sender — a reply
 * containing only digits (e.g. "1" to a quick-reply prompt) has no
 * script to detect, so it falls back to whatever was last detected for
 * that sender rather than resetting to the default every time.
 */
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

const rememberedLocale = new Map<string, Locale>();

const ARABIC_RE = /[؀-ۿ]/;
const LATIN_RE = /[A-Za-z]/;

export function detectAndRememberLocale(waId: string, message: string): Locale {
  const detected: Locale | null = ARABIC_RE.test(message) ? "ar" : LATIN_RE.test(message) ? "en" : null;
  if (detected) {
    rememberedLocale.set(waId, detected);
    return detected;
  }
  return rememberedLocale.get(waId) ?? defaultLocale;
}

/** Exported for tests only. */
export const _localeStoreForTests = rememberedLocale;
