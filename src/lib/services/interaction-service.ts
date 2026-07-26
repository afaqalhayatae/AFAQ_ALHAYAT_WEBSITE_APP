/**
 * PROVISIONAL (M1.1) — 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft —
 * Contract Review Required. Interaction: "channel event linked to consent
 * and retention rules."
 *
 * Known model gap: Interaction.consentId references a Consent by id, but
 * the Consent type (src/types/domain.ts) has no id field and ConsentStore
 * has no lookup by id — only findByChannel. This function can only verify
 * that a granted Consent exists for the interaction's channel, not that the
 * specific consentId is that exact record. Flagged for DATA_MODEL.md review
 * rather than silently treated as fully verified.
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
  const hasGrantedConsent = deps.consents
    .findByChannel(input.channel)
    .some((consent) => consent.status === "granted");

  if (!hasGrantedConsent) {
    writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "interaction.rejected",
      target: input.consentId,
      outcome: "rejected",
    });
    throw new ConsentRequiredError(input.channel);
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
