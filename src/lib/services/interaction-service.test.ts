import { beforeEach, describe, expect, it } from "vitest";
import { recordInteraction } from "./interaction-service";
import { ConsentRequiredError } from "./errors";
import { createInMemoryConsentStore } from "@/lib/adapters/in-memory/consent-store";
import { createInMemoryInteractionRepository } from "@/lib/adapters/in-memory/interaction-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import type {
  ConsentStore,
  InteractionRepository,
  AuditEventRepository,
} from "@/lib/adapters/types";

describe("recordInteraction", () => {
  let consents: ConsentStore;
  let interactions: InteractionRepository;
  let auditEvents: AuditEventRepository;

  beforeEach(() => {
    consents = createInMemoryConsentStore();
    interactions = createInMemoryInteractionRepository();
    auditEvents = createInMemoryAuditEventRepository();
  });

  it("records an interaction when a granted consent exists for the channel", () => {
    consents.record({
      channel: "whatsapp",
      purpose: "booking-updates",
      status: "granted",
      source: "test",
      evidence: "test-fixture",
      recordedAt: "2026-07-26T00:00:00.000Z",
    });

    const interaction = recordInteraction(
      { consents, interactions, auditEvents },
      {
        channel: "whatsapp",
        consentId: "consent-1",
        occurredAt: "2026-07-26T00:05:00.000Z",
        actor: "test-actor",
      }
    );

    expect(interactions.findByConsent("consent-1")).toEqual([interaction]);
  });

  it("rejects when no granted consent exists for the channel", () => {
    expect(() =>
      recordInteraction(
        { consents, interactions, auditEvents },
        {
          channel: "email",
          consentId: "consent-1",
          occurredAt: "2026-07-26T00:05:00.000Z",
          actor: "test-actor",
        }
      )
    ).toThrow(ConsentRequiredError);
    expect(auditEvents.findByActor("test-actor")[0].outcome).toBe("rejected");
  });

  it("rejects when the only consent for the channel was withdrawn", () => {
    consents.record({
      channel: "email",
      purpose: "booking-updates",
      status: "withdrawn",
      source: "test",
      evidence: "test-fixture",
      recordedAt: "2026-07-26T00:00:00.000Z",
    });

    expect(() =>
      recordInteraction(
        { consents, interactions, auditEvents },
        {
          channel: "email",
          consentId: "consent-1",
          occurredAt: "2026-07-26T00:05:00.000Z",
          actor: "test-actor",
        }
      )
    ).toThrow(ConsentRequiredError);
  });
});
