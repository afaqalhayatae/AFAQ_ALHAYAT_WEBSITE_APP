/**
 * PROVISIONAL (M1.1) — 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft —
 * Contract Review Required. Consent: "channel, purpose, status, source,
 * evidence, and timestamps."
 */

import type { Consent } from "@/types/domain";
import type {
  AuditEventRepository,
  ConsentStore,
} from "@/lib/adapters/types";
import { writeAuditEvent } from "./audit";

export interface RecordConsentInput extends Consent {
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
