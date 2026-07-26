/**
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Status: Approved, v0.2). Consent: "id,
 * channel, purpose, status, source, evidence, and timestamps."
 */

import type { Consent } from "@/types/domain";
import type {
  AuditEventRepository,
  ConsentStore,
} from "@/lib/adapters/types";
import { generateId, writeAuditEvent } from "./audit";

export interface RecordConsentInput extends Omit<Consent, "id"> {
  actor: string;
}

export function recordConsent(
  deps: { consents: ConsentStore; auditEvents: AuditEventRepository },
  input: RecordConsentInput
): Consent {
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

  deps.consents.record(consent);
  writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "consent.recorded",
    target: `${consent.channel}:${consent.purpose}`,
    outcome: "success",
  });

  return consent;
}
