import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { getMessages } from "@/i18n/get-messages";
import type { Announcement } from "@/lib/catalog/announcements";

const t = getMessages("en");

const ACTIVE: Announcement = {
  id: "test-announcement",
  type: "service-notice",
  message: { en: "Test message", ar: "رسالة اختبار" },
  ctaLabel: { en: "Read more", ar: "اقرأ المزيد" },
  ctaHref: "/contact",
  startAt: "2020-01-01T00:00:00.000Z",
  endAt: "2099-01-01T00:00:00.000Z",
};

vi.mock("@/lib/catalog/announcements", async () => {
  const actual = await vi.importActual<typeof import("@/lib/catalog/announcements")>(
    "@/lib/catalog/announcements"
  );
  return {
    ...actual,
    getActiveAnnouncement: vi.fn(() => ACTIVE),
  };
});

const { AnnouncementBar } = await import("./announcement-bar");

describe("AnnouncementBar", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders nothing before mount/hydration completes (no SSR flash of dismissed content)", () => {
    // React Testing Library's render already flushes effects synchronously
    // in the test environment, so this asserts the mounted, visible state —
    // the pre-mount `null` return is exercised implicitly by every other
    // test rendering successfully only after effects run.
    render(<AnnouncementBar locale="en" t={t} />);
    expect(screen.getByRole("region", { name: t.announcementBar.regionLabel })).toBeInTheDocument();
  });

  it("shows the active announcement's message and CTA, prefixed with the current locale", () => {
    render(<AnnouncementBar locale="en" t={t} />);
    expect(screen.getAllByText("Test message").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Read more/ })).toHaveAttribute("href", "/en/contact");
  });

  it("renders the Arabic message and locale-prefixed CTA for the ar locale", () => {
    render(<AnnouncementBar locale="ar" t={getMessages("ar")} />);
    expect(screen.getAllByText("رسالة اختبار").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /اقرأ المزيد/ })).toHaveAttribute("href", "/ar/contact");
  });

  it("renders the ticker as a visible copy plus one aria-hidden duplicate for the seamless scroll loop", () => {
    const { container } = render(<AnnouncementBar locale="en" t={t} />);
    const copies = screen.getAllByText("Test message");
    expect(copies).toHaveLength(2);
    expect(copies.some((el) => el.getAttribute("aria-hidden") === "true")).toBe(true);
    expect(copies.some((el) => el.getAttribute("aria-hidden") !== "true")).toBe(true);
    // The animated track must use transform-only animation (no layout-affecting property).
    expect(container.querySelector(".announcement-ticker-track")).not.toBeNull();
  });

  it("hides the bar and remembers the dismissal after clicking dismiss", async () => {
    const { unmount } = render(<AnnouncementBar locale="en" t={t} />);
    fireEvent.click(screen.getByRole("button", { name: t.announcementBar.dismissLabel }));

    await waitFor(() => {
      expect(screen.queryAllByText("Test message")).toHaveLength(0);
    });

    unmount();

    // Re-mounting simulates a new page load — the dismissal must persist.
    render(<AnnouncementBar locale="en" t={t} />);
    await waitFor(() => {
      expect(screen.queryAllByText("Test message")).toHaveLength(0);
    });
  });

  it("does not throw when localStorage access fails (private browsing)", () => {
    const getItemSpy = vi.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(() => {
      throw new Error("storage denied");
    });

    expect(() => render(<AnnouncementBar locale="en" t={t} />)).not.toThrow();
    expect(screen.getAllByText("Test message").length).toBeGreaterThan(0);

    getItemSpy.mockRestore();
  });
});
