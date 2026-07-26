/**
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Status: Approved, v0.2). Interaction:
 * "channel event linked to consent and retention rules." Consent gained an
 * `id` in v0.2 (M1.2), so this now verifies the exact referenced Consent —
 * it must exist, be decision "granted", and its channel must match the
 * interaction's channel — rather than only checking the channel in general.
 */

import type { Interaction } from "@/types/domain";
import type {
  AuditEventRepository,
  ConsentStore,
  InteractionRepository,
} from "@/lib/adapters/types";
import { generateId, writeAuditEvent } from "./audit";
import { ConsentRequiredError } from "./errors";

export interface RecordInteractionInput {
  channel: Interaction["channel"];
  consentId: string;
  occurredAt: string;
  actor: string;
}

export function recordInteraction(
  deps: {
    interactions: InteractionRepository;
    consents: ConsentStore;
    auditEvents: AuditEventRepository;
  },
  input: RecordInteractionInput
): Interaction {
  const consent = deps.consents.findById(input.consentId);
  const isValidConsent =
    consent !== undefined &&
    consent.status === "granted" &&
    consent.channel === input.channel;

  if (!isValidConsent) {
    writeAuditEvent(deps.auditEvents, {
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
  writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "interaction.recorded",
    target: interaction.id,
    outcome: "success",
  });

  return interaction;
}
