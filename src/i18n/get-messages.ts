import arMessages from "@/i18n/messages/ar.json";
import enMessages from "@/i18n/messages/en.json";
import type { Locale } from "@/i18n/config";

const messages: Record<Locale, typeof arMessages> = {
  ar: arMessages,
  en: enMessages,
};

export function getMessages(locale: Locale) {
  return messages[locale];
}
