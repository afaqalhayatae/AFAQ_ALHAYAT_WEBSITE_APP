/**
 * PROVISIONAL (M1.1) — shared helpers used by every service-layer function
 * that mutates state, per DATA_MODEL.md's Audit Event entity ("actor,
 * action, target, outcome, timestamp, and correlation ID") and
 * API_CONTRACTS.md ("record auditable events for approvals and high-impact
 * changes"). 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft — Contract
 * Review Required, so this shape may change when it is approved.
 */

import type { AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";

export function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

// Async (Database Foundation Phase 1J — AuditEvent switchover, the last of
// the six-entity migration series). auditEvents is now
// AsyncAuditEventRepository (satisfied by both the Prisma-backed and the
// factory's async-wrapped in-memory implementation, per
// 07_WEBSITE/BOOKING_SYSTEM/08_REPOSITORY_SWITCHOVER_PLAN.md). This is a
// shared helper called from every domain service that mutates state — every
// one of those callers becomes async as a direct, mechanical consequence of
// this single signature change, not a business-logic change anywhere.
export async function writeAuditEvent(
  auditEvents: AsyncAuditEventRepository,
  params: {
    actor: string;
    action: string;
    target: string;
    outcome: "success" | "rejected";
  }
): Promise<void> {
  await auditEvents.record({
    id: generateId("audit"),
    actor: params.actor,
    action: params.action,
    target: params.target,
    outcome: params.outcome,
    timestamp: new Date().toISOString(),
    correlationId: crypto.randomUUID(),
  });
}
