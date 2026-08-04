/**
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Status: Approved, v0.2). Interaction:
 * "channel event linked to consent and retention rules." Consent gained an
 * `id` in v0.2 (M1.2), so this now verifies the exact referenced Consent —
 * it must exist, be decision "granted", and its channel must match the
 * interaction's channel — rather than only checking the channel in general.
 */

import type { Interaction } from "@/types/domain";
import type { ConsentStore, InteractionRepository } from "@/lib/adapters/types";
import type { AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";
import { generateId, writeAuditEvent } from "./audit";
import { ConsentRequiredError } from "./errors";

export interface RecordInteractionInput {
  channel: Interaction["channel"];
  consentId: string;
  occurredAt: string;
  actor: string;
}

// Async (Database Foundation Phase 1J — AuditEvent switchover). Becomes
// async purely as a consequence of writeAuditEvent's signature change — no
// interaction-validation logic changed. interactions/consents stay the
// existing synchronous repositories, untouched (this function is never
// wired to a live route — its own tests construct fresh in-memory
// instances directly, same as work-order-service.ts).
export async function recordInteraction(
  deps: {
    interactions: InteractionRepository;
    consents: ConsentStore;
    auditEvents: AsyncAuditEventRepository;
  },
  input: RecordInteractionInput
): Promise<Interaction> {
  const consent = deps.consents.findById(input.consentId);
  const isValidConsent =
    consent !== undefined &&
    consent.status === "granted" &&
    consent.channel === input.channel;

  if (!isValidConsent) {
    await writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "interaction.rejected",
      target: input.consentId,
      outcome: "rejected",
    });
    throw new ConsentRequiredError(input.consentId);
  }

  const interaction: Interaction = {
    id: generateId("int"),
    channel: input.channel,
    consentId: input.consentId,
    occurredAt: input.occurredAt,
  };

  deps.interactions.record(interaction);
  await writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "interaction.recorded",
    target: interaction.id,
    outcome: "success",
  });

  return interaction;
}
