/**
 * Server-side post "poster" compositor for the social-content automation
 * (2026-08-07, Owner-requested: "تصميم بوستات احترافيه تناسب الموقع
 * الالكتروني والهويه البصريه" — later refined with real reference designs
 * showing a two-zone layout: left info panel + right photo + bottom
 * trust bar). Matches that reference layout, but every piece of text on
 * it is pulled from real, already-approved sources — never invented:
 *
 * - Title: the service's real approved name (`services.entries[slug].name`).
 * - Left-panel bullets: the service's real `scope.included` items
 *   (`service-content.ts`, same gate the service pages themselves use).
 * - Bottom trust bar: the exact same 4 real `trustBadges` already live
 *   on that service's landing page hero (`landing-pages.ts`) — reused,
 *   not duplicated with new wording.
 * - Photo: the same real, already-approved photo the landing page uses
 *   (never a stock or AI-generated "customer result", per
 *   `MEDIA_STANDARDS.md`).
 *
 * Note on the reference designs this replaces: they included a "ضمان على
 * جميع الأعمال" (warranty on all work) badge. That's not reused here —
 * every pricing/warranty section on the live site explicitly says
 * warranty terms are "subject to company policy," never a blanket
 * guarantee (see any landing page's FAQ), so stamping "warranty on all
 * work" onto every automated post for 26 services would be exactly the
 * kind of unverified claim this project's whole content-governance
 * discipline exists to prevent. The 4 real trustBadges already approved
 * per service take that slot instead — same visual effect, no invented
 * claim.
 *
 * GET-only, API-key gated (same `SOCIAL_CONTENT_API_KEY` as
 * `social-content/facts`) — read-only, no write access.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { isLocale, type Locale } from "@/i18n/config";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { getLandingPage } from "@/lib/catalog/landing-pages";
import { getServiceContent } from "@/lib/catalog/service-content";
import { PHONE_DISPLAY } from "@/lib/brand/links";

function isAuthorized(request: NextRequest): boolean {
  const configuredKey = process.env.SOCIAL_CONTENT_API_KEY;
  if (!configuredKey) return false;
  return request.headers.get("x-api-key") === configuredKey;
}

/**
 * Baseline dimensions per `POST_DESIGN_AND_ENGAGEMENT_PLAYBOOK.md` §1 —
 * verify against each platform's current developer docs before relying
 * on these as permanently fixed, same caution that document states.
 */
const PLATFORM_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "instagram-feed": { width: 1080, height: 1350 },
  "instagram-story": { width: 1080, height: 1920 },
  "facebook-feed": { width: 1080, height: 1350 },
  "linkedin-feed": { width: 1200, height: 1500 },
  "pinterest-pin": { width: 1000, height: 1500 },
  "tiktok-cover": { width: 1080, height: 1920 },
  "x-feed": { width: 1200, height: 1000 },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Simple greedy word-wrap by character budget — good enough for the
 *  short phrases this template ever renders (titles, bullets, badge
 *  labels), not general-purpose paragraph layout. */
function wrapLines(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[lines.length - 1] = `${lines[lines.length - 1]}…`;
  }
  return lines.slice(0, maxLines);
}

const CHECK_ICON_PATH = "M5 12.5l4.5 4.5L19 7"; // 24x24 viewBox checkmark
const SHIELD_ICON_PATH =
  "M12 2.8 19 5.8v6.2c0 5.2-3.3 8.6-7 9.9-3.7-1.3-7-4.7-7-9.9V5.8L12 2.8Z M8.5 12l2.4 2.4L15.8 9.5";
const STAR_ICON_PATH =
  "M12 3.3l2.9 6 6.6.9-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-.9 2.9-6Z";

/** Renders one small line-icon (24x24 space) used in trust-bar badges. */
function iconMarkup(kind: "shield" | "user" | "clock" | "star" | "check", cx: number, cy: number, scale: number): string {
  const t = `translate(${cx - 12 * scale} ${cy - 12 * scale}) scale(${scale})`;
  const stroke = `stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  if (kind === "shield") return `<g transform="${t}"><path d="${SHIELD_ICON_PATH}" ${stroke} /></g>`;
  if (kind === "star") return `<g transform="${t}"><path d="${STAR_ICON_PATH}" ${stroke} /></g>`;
  if (kind === "check") return `<g transform="${t}"><path d="${CHECK_ICON_PATH}" ${stroke} /></g>`;
  if (kind === "clock")
    return `<g transform="${t}"><circle cx="12" cy="12" r="8.5" ${stroke} /><path d="M12 7v5l3.2 2" ${stroke} /></g>`;
  return `<g transform="${t}"><circle cx="12" cy="8" r="3.6" ${stroke} /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" ${stroke} /></g>`;
}

const TRUST_ICONS: ("shield" | "user" | "clock" | "star")[] = ["shield", "user", "clock", "star"];

function posterOverlaySvg(params: {
  width: number;
  height: number;
  rtl: boolean;
  title: string;
  bullets: string[];
  trustBadges: string[];
  phone: string;
}): Buffer {
  const { width, height, rtl, title, bullets, trustBadges, phone } = params;
  const panelWidth = Math.round(width * 0.36);
  const barHeight = Math.round(height * 0.1);
  const panelStartX = rtl ? width - panelWidth : 0;
  const textAnchor = rtl ? "end" : "start";
  const textX = rtl ? panelStartX + panelWidth - panelWidth * 0.09 : panelWidth * 0.09;

  const titleLines = wrapLines(title, 11, 2);
  const titleFontSize = Math.round(panelWidth * 0.135);
  const titleStartY = Math.round(height * 0.2);

  const bulletsMarkup = bullets
    .slice(0, 3)
    .map((bullet, index) => {
      const lines = wrapLines(bullet, 20, 2);
      const groupY = titleStartY + titleLines.length * titleFontSize * 1.15 + 60 + index * 92;
      const badgeCx = rtl ? panelStartX + panelWidth - panelWidth * 0.14 : panelWidth * 0.14;
      const textStartX = rtl ? badgeCx - 44 : badgeCx + 44;
      const lineMarkup = lines
        .map(
          (line, li) =>
            `<text x="${textStartX}" y="${groupY + li * 30}" text-anchor="${textAnchor}" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="22" fill="#1e2a3a">${escapeXml(line)}</text>`
        )
        .join("");
      return `
        <rect x="${badgeCx - 22}" y="${groupY - 30}" width="44" height="44" rx="10" fill="#0f4c81" />
        ${iconMarkup("check", badgeCx, groupY - 8, 1)}
        ${lineMarkup}
      `;
    })
    .join("");

  // Trust badges always fill the photo-width zone (never the panel zone,
  // where the phone number lives) — which side that is flips with rtl,
  // same as the photo itself, so the two never collide.
  const photoZoneStart = rtl ? 0 : panelWidth;
  const badgeSlotWidth = (width - panelWidth) / trustBadges.length;
  const trustMarkup = trustBadges
    .map((label, index) => {
      const slotStart = photoZoneStart + index * badgeSlotWidth;
      const centerX = slotStart + badgeSlotWidth / 2;
      const lines = wrapLines(label, 16, 2);
      const lineMarkup = lines
        .map(
          (line, li) =>
            `<text x="${centerX}" y="${height - barHeight * 0.32 + li * 20}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="16" fill="#ffffff">${escapeXml(line)}</text>`
        )
        .join("");
      return `${iconMarkup(TRUST_ICONS[index % TRUST_ICONS.length], centerX, height - barHeight * 0.62, 1.15)}${lineMarkup}`;
    })
    .join("");

  // Centered within the panel-width zone (never the photo-width zone the
  // trust badges fill) so the two can never overlap, regardless of locale.
  const phoneX = panelStartX + panelWidth / 2;
  const phoneAnchor = "middle";

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${panelStartX}" y="0" width="${panelWidth}" height="${height - barHeight}" fill="#ffffff" />
      ${titleLines
        .map(
          (line, i) =>
            `<text x="${textX}" y="${titleStartY + i * titleFontSize * 1.15}" text-anchor="${textAnchor}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${titleFontSize}" fill="#0f4c81">${escapeXml(line)}</text>`
        )
        .join("")}
      ${bulletsMarkup}
      <rect x="0" y="${height - barHeight}" width="${width}" height="${barHeight}" fill="#0f2a4a" />
      <text x="${phoneX}" y="${height - barHeight * 0.38}" text-anchor="${phoneAnchor}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${Math.round(barHeight * 0.34)}" fill="#25d366">${escapeXml(phone)}</text>
      ${trustMarkup}
    </svg>
  `;
  return Buffer.from(svg);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");
  const platform = searchParams.get("platform") ?? "instagram-feed";
  const localeParam = searchParams.get("locale") ?? "ar";

  if (!slug) {
    return NextResponse.json({ error: "slug query parameter is required" }, { status: 400 });
  }
  if (!isLocale(localeParam)) {
    return NextResponse.json({ error: "invalid locale" }, { status: 400 });
  }
  const locale = localeParam as Locale;

  const dimensions = PLATFORM_DIMENSIONS[platform];
  if (!dimensions) {
    return NextResponse.json(
      { error: `unknown platform "${platform}"`, knownPlatforms: Object.keys(PLATFORM_DIMENSIONS) },
      { status: 400 }
    );
  }

  const landingPage = getLandingPage(slug);
  if (!landingPage) {
    return NextResponse.json({ error: "unknown or unapproved slug" }, { status: 404 });
  }

  const entry = getServiceEntry(getMessages(locale), slug);
  const content = getServiceContent(slug, locale);
  const title = entry?.name ?? landingPage.hero.eyebrow[locale];
  const bullets = content?.scope.included.slice(0, 3) ?? [];
  const trustBadges = landingPage.hero.trustBadges.map((badge) => badge[locale]);

  const { width, height } = dimensions;
  const photoPath = path.join(process.cwd(), "public", landingPage.hero.image.src);
  const logoPath = path.join(process.cwd(), "public", "brand", "logo-mark.png");

  let photoBuffer: Buffer;
  try {
    photoBuffer = await readFile(photoPath);
  } catch {
    return NextResponse.json({ error: "source photo not found on disk" }, { status: 500 });
  }

  const panelWidth = Math.round(width * 0.36);
  const rtl = locale === "ar";
  const photoAreaWidth = width - panelWidth;

  const resizedPhoto = await sharp(photoBuffer)
    .resize(photoAreaWidth, height, { fit: "cover", position: "attention" })
    .toBuffer();

  const logoSize = Math.round(panelWidth * 0.34);
  const logoBuffer = await sharp(await readFile(logoPath)).resize(logoSize, logoSize).toBuffer();

  const overlay = posterOverlaySvg({ width, height, rtl, title, bullets, trustBadges, phone: PHONE_DISPLAY });

  const composed = await sharp({
    create: { width, height, channels: 4, background: "#ffffff" },
  })
    .composite([
      { input: resizedPhoto, top: 0, left: rtl ? 0 : panelWidth },
      { input: overlay, top: 0, left: 0 },
      {
        input: logoBuffer,
        top: Math.round(height * 0.05),
        left: rtl ? width - panelWidth + Math.round(panelWidth * 0.09) : Math.round(panelWidth * 0.09),
      },
    ])
    .webp({ quality: 90 })
    .toBuffer();

  return new NextResponse(new Uint8Array(composed), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "no-store",
    },
  });
}
