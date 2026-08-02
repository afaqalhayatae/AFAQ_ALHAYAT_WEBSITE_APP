/**
 * Announcement bar registry — Phase A per
 * 07_WEBSITE/IMPLEMENTATION/10_ANNOUNCEMENT_BAR_ARCHITECTURE.md (v1.2).
 * No database/schema change: this mirrors the same in-repo catalog-array
 * pattern already used by `SERVICES` and `BLOG_POSTS`. Publishing an
 * announcement is a code review + deploy, same as adding a blog post.
 *
 * `ANNOUNCEMENTS` stays empty by design, not as a placeholder awaiting
 * copy — no fabricated offer, notice, or article promotion may ever
 * appear here without the approval evidence its type requires (see the
 * architecture doc §0's commercial-content constraint for
 * `limited-time-offer`). Adding a real, approved entry is the entire
 * publishing step; no other code changes are needed.
 */

export type AnnouncementType = "service-notice" | "limited-time-offer" | "new-article";

/**
 * Priority order, highest first — Owner-approved 2026-07-28
 * (architecture doc §3): Important Service Notices > Limited-Time
 * Offers > New Articles. "General Announcements" (lowest tier in the
 * approved architecture) is not implemented in this first phase.
 */
const TYPE_PRIORITY: Record<AnnouncementType, number> = {
  "service-notice": 1,
  "limited-time-offer": 2,
  "new-article": 3,
};

export type Announcement = {
  id: string;
  type: AnnouncementType;
  message: { en: string; ar: string };
  ctaLabel?: { en: string; ar: string };
  /** Locale-agnostic path (e.g. "/contact") — the component prefixes the active locale. */
  ctaHref?: string;
  /** ISO timestamp. Required — an announcement is never active before it. */
  startAt: string;
  /**
   * ISO timestamp. Mandatory for "limited-time-offer" and "new-article"
   * per the architecture doc §7; "service-notice" may omit it for a
   * standing notice, but should still be reviewed periodically by the
   * Owner rather than left indefinitely.
   */
  endAt?: string;
};

/**
 * Visual-QA switch only (mirrors `SHOW_DEMO_VISUALS` in
 * src/lib/media/demo-visuals.ts) — flip to `false` for any real build;
 * never ship `true`. The demo entry below is clearly labeled as not a
 * real announcement in both languages. Flipped back to `false` for the
 * Final Clean Preview Pass, per this constant's own rule above.
 */
export const SHOW_DEMO_ANNOUNCEMENT = false;

/**
 * Preview content only — requested for a live demo preview session
 * (2026-07-28). Both language strings carry an explicit "(Demo preview)"
 * marker so this can never be mistaken for a real, approved offer if
 * viewed over the network preview URL or screenshotted; the underlying
 * service (Pest Control) is still under its own package Evidence Gate
 * and no real offer/discount has been approved. `SHOW_DEMO_ANNOUNCEMENT`
 * must be flipped back to `false` before any commit — never ship `true`.
 */
const DEMO_ANNOUNCEMENT: Announcement = {
  id: "demo-announcement",
  type: "limited-time-offer",
  message: {
    en: "🔥 Special Offer: Book Pest Control Service Now (Demo preview — not a live offer)",
    ar: "🔥 عرض خاص: احجز خدمة مكافحة الحشرات الآن (معاينة تجريبية — ليس عرضًا فعليًا)",
  },
  ctaLabel: { en: "Book Now", ar: "احجز الآن" },
  ctaHref: "/services/pest-control",
  startAt: "2000-01-01T00:00:00.000Z",
  endAt: "2999-01-01T00:00:00.000Z",
};

export const ANNOUNCEMENTS: Announcement[] = SHOW_DEMO_ANNOUNCEMENT ? [DEMO_ANNOUNCEMENT] : [];

/**
 * Selects the single announcement to display: the highest-priority
 * announcement whose current-time window is active, or `null` if none
 * is — never more than one, never a rotation (architecture doc §2).
 * `announcements` defaults to the real registry but is injectable, like
 * `getLatestPosts` in `blog.ts`, so this pure selection logic can be
 * unit-tested with fixture data without touching `ANNOUNCEMENTS` itself.
 */
export function getActiveAnnouncement(
  announcements: Announcement[] = ANNOUNCEMENTS,
  now: Date = new Date()
): Announcement | null {
  const active = announcements.filter((announcement) => {
    const start = new Date(announcement.startAt);
    const end = announcement.endAt ? new Date(announcement.endAt) : null;
    return now >= start && (!end || now <= end);
  });

  if (active.length === 0) return null;

  return [...active].sort((a, b) => TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type])[0];
}

/**
 * Stable content-version key (Owner-approved dismiss behavior,
 * 2026-07-28): editing an announcement's message/CTA changes this
 * value, which is what makes it eligible to reappear for a user who
 * dismissed the prior wording. Deliberately computed from content, not
 * hand-maintained, so no one has to remember to bump a version number.
 */
export function getContentVersion(announcement: Announcement): string {
  const raw = [
    announcement.id,
    announcement.message.en,
    announcement.message.ar,
    announcement.ctaHref ?? "",
    announcement.ctaLabel?.en ?? "",
    announcement.ctaLabel?.ar ?? "",
  ].join("|");

  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}
