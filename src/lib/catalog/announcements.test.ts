import { describe, expect, it } from "vitest";
import { getActiveAnnouncement, getContentVersion, type Announcement } from "./announcements";

function makeAnnouncement(overrides: Partial<Announcement>): Announcement {
  return {
    id: "a1",
    type: "new-article",
    message: { en: "English message", ar: "رسالة عربية" },
    startAt: "2020-01-01T00:00:00.000Z",
    endAt: "2099-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("getActiveAnnouncement", () => {
  const now = new Date("2026-01-01T00:00:00.000Z");

  it("returns null when there are no announcements", () => {
    expect(getActiveAnnouncement([], now)).toBeNull();
  });

  it("returns null when the only announcement is outside its window", () => {
    const future = makeAnnouncement({ startAt: "2099-01-01T00:00:00.000Z" });
    const expired = makeAnnouncement({ id: "a2", endAt: "2020-01-01T00:00:00.000Z" });
    expect(getActiveAnnouncement([future, expired], now)).toBeNull();
  });

  it("returns an open-ended (no endAt) announcement once started", () => {
    const notice = makeAnnouncement({ id: "notice", type: "service-notice", endAt: undefined });
    expect(getActiveAnnouncement([notice], now)?.id).toBe("notice");
  });

  it("picks the highest-priority active announcement: service-notice > offer > article", () => {
    const article = makeAnnouncement({ id: "article", type: "new-article" });
    const offer = makeAnnouncement({ id: "offer", type: "limited-time-offer" });
    const notice = makeAnnouncement({ id: "notice", type: "service-notice" });

    expect(getActiveAnnouncement([article, offer], now)?.id).toBe("offer");
    expect(getActiveAnnouncement([offer, notice], now)?.id).toBe("notice");
    expect(getActiveAnnouncement([article, offer, notice], now)?.id).toBe("notice");
  });

  it("never returns more than one announcement even when several are active", () => {
    const a = makeAnnouncement({ id: "a", type: "new-article" });
    const b = makeAnnouncement({ id: "b", type: "new-article" });
    const result = getActiveAnnouncement([a, b], now);
    expect(result).not.toBeNull();
    expect([a.id, b.id]).toContain(result?.id);
  });
});

describe("getContentVersion", () => {
  it("is stable for the same content", () => {
    const a = makeAnnouncement({});
    const b = makeAnnouncement({});
    expect(getContentVersion(a)).toBe(getContentVersion(b));
  });

  it("changes when the message changes", () => {
    const original = makeAnnouncement({});
    const edited = makeAnnouncement({ message: { en: "Updated message", ar: "رسالة محدثة" } });
    expect(getContentVersion(original)).not.toBe(getContentVersion(edited));
  });

  it("changes when the CTA changes", () => {
    const original = makeAnnouncement({ ctaHref: "/en/contact" });
    const edited = makeAnnouncement({ ctaHref: "/en/services" });
    expect(getContentVersion(original)).not.toBe(getContentVersion(edited));
  });
});
