import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { recordInteraction } from "./interaction-service";
import { ConsentRequiredError } from "./errors";
import { createInMemoryConsentStore } from "@/lib/adapters/in-memory/consent-store";
import { createInMemoryInteractionRepository } from "@/lib/adapters/in-memory/interaction-repository";
import { getAuditEventRepository } from "@/lib/adapters/repository-factory";
import type { ConsentStore, InteractionRepository } from "@/lib/adapters/types";
import type { AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";

// Database Foundation Phase 1J — AuditEvent switchover. recordInteraction
// became async purely as a consequence of writeAuditEvent's signature
// change — no interaction-validation logic changed. consents/interactions
// stay the existing synchronous repositories, untouched (this function is
// never wired to a live route).
describe("recordInteraction", () => {
  let consents: ConsentStore;
  let interactions: InteractionRepository;
  let auditEvents: AsyncAuditEventRepository;

  beforeEach(() => {
    consents = createInMemoryConsentStore();
    interactions = createInMemoryInteractionRepository();
    auditEvents = getAuditEventRepository();
  });

  afterEach(async () => {
    await auditEvents.clear();
  });

  it("records an interaction when the referenced consent exists and is granted", async () => {
    consents.record({
      id: "consent-1",
      channel: "whatsapp",
      purpose: "booking-updates",
      status: "granted",
      source: "test",
      evidence: "test-fixture",
      recordedAt: "2026-07-26T00:00:00.000Z",
    });

    const interaction = await recordInteraction(
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

  it("rejects when the referenced consent id does not exist", async () => {
    await expect(
      recordInteraction(
        { consents, interactions, auditEvents },
        {
          channel: "whatsapp",
          consentId: "missing-consent",
          occurredAt: "2026-07-26T00:05:00.000Z",
          actor: "test-actor",
        }
      )
    ).rejects.toThrow(ConsentRequiredError);
    const events = await auditEvents.findByActor("test-actor");
    expect(events[0].outcome).toBe("rejected");
    expect(interactions.findByConsent("missing-consent")).toEqual([]);
  });

  it("rejects when the referenced consent was withdrawn", async () => {
    consents.record({
      id: "consent-1",
      channel: "email",
      purpose: "booking-updates",
      status: "withdrawn",
      source: "test",
      evidence: "test-fixture",
      recordedAt: "2026-07-26T00:00:00.000Z",
    });

    await expect(
      recordInteraction(
        { consents, interactions, auditEvents },
        {
          channel: "email",
          consentId: "consent-1",
          occurredAt: "2026-07-26T00:05:00.000Z",
          actor: "test-actor",
        }
      )
    ).rejects.toThrow(ConsentRequiredError);
  });

  it("rejects when the referenced consent's channel does not match", async () => {
    consents.record({
      id: "consent-1",
      channel: "email",
      purpose: "booking-updates",
      status: "granted",
      source: "test",
      evidence: "test-fixture",
      recordedAt: "2026-07-26T00:00:00.000Z",
    });

    await expect(
      recordInteraction(
        { consents, interactions, auditEvents },
        {
          channel: "whatsapp",
          consentId: "consent-1",
          occurredAt: "2026-07-26T00:05:00.000Z",
          actor: "test-actor",
        }
      )
    ).rejects.toThrow(ConsentRequiredError);
  });
});
