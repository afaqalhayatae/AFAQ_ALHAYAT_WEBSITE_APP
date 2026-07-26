import { beforeEach, describe, expect, it } from "vitest";
import { recordConsent } from "./consent-service";
import { createInMemoryConsentStore } from "@/lib/adapters/in-memory/consent-store";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import type { ConsentStore, AuditEventRepository } from "@/lib/adapters/types";

describe("recordConsent", () => {
  let consents: ConsentStore;
  let auditEvents: AuditEventRepository;

  beforeEach(() => {
    consents = createInMemoryConsentStore();
    auditEvents = createInMemoryAuditEventRepository();
  });

  it("records a valid consent and an audit event", () => {
    const consent = recordConsent(
      { consents, auditEvents },
      {
        channel: "whatsapp",
        purpose: "booking-updates",
        status: "granted",
        source: "test",
        evidence: "test-fixture",
        recordedAt: "2026-07-26T00:00:00.000Z",
        actor: "test-actor",
      }
    );

    expect(consent.id).toMatch(/^consent_/);
    expect(consents.findById(consent.id)).toEqual(consent);
    expect(consents.findByChannel("whatsapp")).toEqual([consent]);
    expect(auditEvents.findByActor("test-actor")).toHaveLength(1);
  });

  it("rejects an invalid recordedAt timestamp", () => {
    expect(() =>
      recordConsent(
        { consents, auditEvents },
        {
          channel: "whatsapp",
          purpose: "booking-updates",
          status: "granted",
          source: "test",
          evidence: "test-fixture",
          recordedAt: "not-a-date",
          actor: "test-actor",
        }
      )
    ).toThrow();
  });
});
