/**
 * Read-only fact source for the social-media content-drafting automation
 * (2026-08-07, Owner-requested — "إدارة السوشيال ميديا والنشر وتصميم
 * المنشورات والوصف والعنوان والكلمات المفتاحية" via n8n). This is the one
 * new piece the already-Approved `10_MARKETING_AND_SEO/SOCIAL_MEDIA/
 * AUTOMATION_AND_PUBLISHING.md` architecture needed: a real source n8n's
 * AI-drafting step can call so it only ever sees real, Owner-approved
 * facts (never invents a service, benefit, or claim) — the workflow
 * itself still stops at a Class B approval queue, never auto-publishes,
 * per that document's Fast-Track Classes.
 *
 * Deliberately narrow: GET only, returns exactly what already renders on
 * the public website (same `APPROVED_SERVICE_CONTENT_SLUGS` gate the
 * service pages themselves use) — nothing here is a new fact, only a
 * machine-readable reshaping of already-public content. Gated by a
 * shared API key anyway (not meant for public/anonymous scraping,
 * consistent with this repo's other integration endpoints).
 */

import { NextRequest, NextResponse } from "next/server";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { APPROVED_SERVICE_CONTENT_SLUGS, getServiceContent } from "@/lib/catalog/service-content";
import { getLandingPage } from "@/lib/catalog/landing-pages";
import { SITE_URL } from "@/lib/brand/links";

function isAuthorized(request: NextRequest): boolean {
  const configuredKey = process.env.SOCIAL_CONTENT_API_KEY;
  if (!configuredKey) return false;
  return request.headers.get("x-api-key") === configuredKey;
}

function listEntries() {
  return APPROVED_SERVICE_CONTENT_SLUGS.map((slug) => ({
    slug,
    name: {
      en: getServiceEntry(getMessages("en"), slug)?.name,
      ar: getServiceEntry(getMessages("ar"), slug)?.name,
    },
    hasLandingPage: Boolean(getLandingPage(slug)),
  }));
}

type LocaleFacts = {
  name: string | null;
  description: string | null;
  heroTagline: string | null;
  overview: string | null;
  commonProblems: string[];
  benefits: string[];
  scopeIncluded: string[];
  keywords: string[];
};

function localeFacts(slug: string, locale: Locale): LocaleFacts {
  const entry = getServiceEntry(getMessages(locale), slug);
  const content = getServiceContent(slug, locale);
  const landingPage = getLandingPage(slug);
  return {
    name: entry?.name ?? null,
    description: entry?.description ?? null,
    heroTagline: content?.heroTagline ?? null,
    overview: content?.overview ?? null,
    commonProblems: content?.commonProblems ?? [],
    benefits: content?.benefits ?? [],
    scopeIncluded: content?.scope.included ?? [],
    keywords: landingPage?.seo.keywords[locale] ?? [],
  };
}

function factsForSlug(slug: string) {
  if (!APPROVED_SERVICE_CONTENT_SLUGS.includes(slug)) return null;

  const landingPage = getLandingPage(slug);
  const byLocale = Object.fromEntries(locales.map((locale) => [locale, localeFacts(slug, locale)])) as Record<
    Locale,
    LocaleFacts
  >;

  return {
    slug,
    canonicalUrl: `${SITE_URL}/en/services/${slug}`,
    image: landingPage
      ? { src: `${SITE_URL}${landingPage.hero.image.src}`, alt: landingPage.hero.alt }
      : null,
    byLocale,
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");
  const localeParam = searchParams.get("locale");

  if (localeParam && !isLocale(localeParam)) {
    return NextResponse.json({ error: "invalid locale" }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ services: listEntries() });
  }

  const facts = factsForSlug(slug);
  if (!facts) {
    return NextResponse.json({ error: "unknown or unapproved slug" }, { status: 404 });
  }

  if (localeParam) {
    const locale = localeParam as Locale;
    return NextResponse.json({
      slug: facts.slug,
      canonicalUrl: facts.canonicalUrl,
      image: facts.image,
      locale,
      ...facts.byLocale[locale],
    });
  }

  return NextResponse.json(facts);
}
