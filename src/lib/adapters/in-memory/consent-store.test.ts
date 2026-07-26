import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryConsentStore } from "./consent-store";
import type { Consent } from "@/types/domain";
import type { ConsentStore } from "@/lib/adapters/types";

const sample: Consent = {
  channel: "whatsapp",
  purpose: "booking-updates",
  status: "granted",
  source: "test",
  evidence: "test-fixture",
  recordedAt: "2026-07-26T00:00:00.000Z",
};

describe("in-memory ConsentStore", () => {
  let store: ConsentStore;

  beforeEach(() => {
    store = createInMemoryConsentStore();
  });

  it("records and retrieves consents by channel", () => {
    store.record(sample);
    expect(store.findByChannel("whatsapp")).toEqual([sample]);
    expect(store.findByChannel("email")).toEqual([]);
  });

  it("clears all recorded consents", () => {
    store.record(sample);
    store.clear();
    expect(store.findByChannel("whatsapp")).toEqual([]);
  });
});
