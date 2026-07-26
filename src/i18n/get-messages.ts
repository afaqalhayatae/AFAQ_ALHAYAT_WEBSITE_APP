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

type Messages = ReturnType<typeof getMessages>;

/**
 * `services.entries` is keyed by the literal slugs present in the JSON
 * messages, so indexing it with a plain `string` (e.g. from the
 * locale-agnostic SERVICES catalog) needs a typed accessor rather than a
 * cast at every call site.
 */
export function getServiceEntry(t: Messages, slug: string) {
  return t.services.entries[slug as keyof Messages["services"]["entries"]];
}
