/**
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Status: Approved, v0.2). Consent: "id,
 * channel, purpose, status, source, evidence, and timestamps."
 */

import type { Consent } from "@/types/domain";
import type { AsyncConsentStore, AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";
import { generateId, writeAuditEvent } from "./audit";

export interface RecordConsentInput extends Omit<Consent, "id"> {
  actor: string;
}

// consents (Phase 1E) and auditEvents (Phase 1J) are both now async-typed —
// both are awaited below. No business logic changed either time, only the
// repository contract each dependency satisfies.
export async function recordConsent(
  deps: { consents: AsyncConsentStore; auditEvents: AsyncAuditEventRepository },
  input: RecordConsentInput
): Promise<Consent> {
  if (!input.purpose || !input.source || !input.evidence) {
    throw new Error("purpose, source, and evidence are required");
  }
  if (Number.isNaN(Date.parse(input.recordedAt))) {
    throw new Error("recordedAt must be a valid ISO timestamp");
  }

  const consent: Consent = {
    id: generateId("consent"),
    channel: input.channel,
    purpose: input.purpose,
    status: input.status,
    source: input.source,
    evidence: input.evidence,
    recordedAt: input.recordedAt,
  };

  await deps.consents.record(consent);
  await writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "consent.recorded",
    target: `${consent.channel}:${consent.purpose}`,
    outcome: "success",
  });

  return consent;
}
