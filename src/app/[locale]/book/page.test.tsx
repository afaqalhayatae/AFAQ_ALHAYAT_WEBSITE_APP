import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BookPage from "./page";
import { getMessages } from "@/i18n/get-messages";

const noParams = Promise.resolve({});

describe("BookPage", () => {
  it("renders the booking form for English", async () => {
    const element = await BookPage({
      params: Promise.resolve({ locale: "en" }),
      searchParams: noParams,
    });
    render(element);

    const t = getMessages("en");
    expect(
      screen.getByRole("heading", { level: 1, name: t.booking.hero.title })
    ).toBeInTheDocument();
    // Service is now the first step (Professional Booking System
    // Foundation — step order matches MOBILE.md), not Customer Details.
    expect(
      screen.getByRole("button", { name: t.booking.service.categories.maintenance })
    ).toBeInTheDocument();
  });

  it("renders the booking form for Arabic", async () => {
    const element = await BookPage({
      params: Promise.resolve({ locale: "ar" }),
      searchParams: noParams,
    });
    render(element);

    const t = getMessages("ar");
    expect(
      screen.getByRole("heading", { level: 1, name: t.booking.hero.title })
    ).toBeInTheDocument();
  });

  it("rejects an unsupported locale", async () => {
    await expect(
      BookPage({ params: Promise.resolve({ locale: "fr" }), searchParams: noParams })
    ).rejects.toThrow();
  });

  it("renders successfully with a real ?service= slug (prefill logic itself is covered in booking-form.test.tsx)", async () => {
    const element = await BookPage({
      params: Promise.resolve({ locale: "en" }),
      searchParams: Promise.resolve({ service: "pest-control" }),
    });
    render(element);

    const t = getMessages("en");
    // Service is now the first step (Professional Booking System
    // Foundation — step order matches MOBILE.md), not Customer Details.
    expect(
      screen.getByRole("button", { name: t.booking.service.categories.maintenance })
    ).toBeInTheDocument();
  });

  it("renders successfully with an unrecognized ?service= slug rather than crashing", async () => {
    const element = await BookPage({
      params: Promise.resolve({ locale: "en" }),
      searchParams: Promise.resolve({ service: "not-a-real-service" }),
    });
    render(element);

    const t = getMessages("en");
    // Service is now the first step (Professional Booking System
    // Foundation — step order matches MOBILE.md), not Customer Details.
    expect(
      screen.getByRole("button", { name: t.booking.service.categories.maintenance })
    ).toBeInTheDocument();
  });
});
