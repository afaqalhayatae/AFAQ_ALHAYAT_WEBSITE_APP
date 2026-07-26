/**
 * PROVISIONAL (M1.1) — shared helpers used by every service-layer function
 * that mutates state, per DATA_MODEL.md's Audit Event entity ("actor,
 * action, target, outcome, timestamp, and correlation ID") and
 * API_CONTRACTS.md ("record auditable events for approvals and high-impact
 * changes"). 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft — Contract
 * Review Required, so this shape may change when it is approved.
 */

import type { AuditEventRepository } from "@/lib/adapters/types";

export function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function writeAuditEvent(
  auditEvents: AuditEventRepository,
  params: {
    actor: string;
    action: string;
    target: string;
    outcome: "success" | "rejected";
  }
): void {
  auditEvents.record({
    id: generateId("audit"),
    actor: params.actor,
    action: params.action,
    target: params.target,
    outcome: params.outcome,
    timestamp: new Date().toISOString(),
    correlationId: crypto.randomUUID(),
  });
}
