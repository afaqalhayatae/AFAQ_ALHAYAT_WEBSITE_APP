import arMessages from "@/i18n/messages/ar.json";
import enMessages from "@/i18n/messages/en.json";
import type { Locale } from "@/i18n/config";
import type { BlogCategory } from "@/lib/catalog/blog";

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

/**
 * "company-guides" has no counterpart in `services.categories`, so blog
 * category labels need the same kind of narrowing helper as service slugs.
 */
export function getBlogCategoryLabel(t: Messages, category: BlogCategory) {
  return category === "company-guides"
    ? t.blog.categories.companyGuides
    : t.services.categories[category];
}

/**
 * `locations.entries` mirrors `services.entries` (JOB-AGT-WEB-20260730
 * emirates-expansion structure phase) — today it only has a "dubai" key,
 * since that's the only emirate with approved copy. Indexing with any
 * other emirate slug (from the locale-agnostic ALL_EMIRATES catalog)
 * correctly returns `undefined` at runtime; callers must treat the
 * result as optional rather than assuming every emirate resolves.
 */
export function getLocationEntry(t: Messages, slug: string) {
  return t.locations.entries[slug as keyof Messages["locations"]["entries"]] as
    | Messages["locations"]["entries"]["dubai"]
    | undefined;
}
