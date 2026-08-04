import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { createPrismaConsentStore } from "./consent-store";
import { prisma } from "./client";
import type { Consent } from "@/types/domain";
import type { AsyncConsentStore } from "./types";

// Mirrors in-memory/consent-store.test.ts's contract, adapted for the real
// async database call and the DateTime<->ISO string round-trip on
// recordedAt. Skipped without a reachable DATABASE_URL.
const sample: Consent = {
  id: "consent-prisma-1",
  channel: "whatsapp",
  purpose: "booking-updates",
  status: "granted",
  source: "test",
  evidence: "test-fixture",
  recordedAt: "2026-07-26T00:00:00.000Z",
};

describe.skipIf(!process.env.DATABASE_URL)("Prisma ConsentStore", () => {
  let store: AsyncConsentStore;

  beforeEach(() => {
    store = createPrismaConsentStore();
  });

  afterEach(async () => {
    await store.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("records and retrieves consents by channel", async () => {
    await store.record(sample);
    await expect(store.findByChannel("whatsapp")).resolves.toEqual([sample]);
    await expect(store.findByChannel("email")).resolves.toEqual([]);
  });

  it("records and retrieves a consent by id", async () => {
    await store.record(sample);
    await expect(store.findById("consent-prisma-1")).resolves.toEqual(sample);
    await expect(store.findById("missing")).resolves.toBeUndefined();
  });

  it("clears all recorded consents", async () => {
    await store.record(sample);
    await store.clear();
    await expect(store.findByChannel("whatsapp")).resolves.toEqual([]);
    await expect(store.findById("consent-prisma-1")).resolves.toBeUndefined();
  });
});
