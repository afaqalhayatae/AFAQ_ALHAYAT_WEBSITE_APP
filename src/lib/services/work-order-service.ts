/**
 * PROVISIONAL (M1.1) — 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft —
 * Contract Review Required. Work Order: "created only by an approved
 * operational workflow." createWorkOrder refuses unless the referenced
 * Approval exists and its decision is exactly "approved" — it never
 * decides the approval itself.
 */

import type { WorkOrder } from "@/types/domain";
import type {
  ApprovalRepository,
  AuditEventRepository,
  BookingRequestRepository,
  WorkOrderRepository,
} from "@/lib/adapters/types";
import { generateId, writeAuditEvent } from "./audit";
import {
  ApprovalRequiredError,
  UnknownBookingRequestError,
} from "./errors";

export interface CreateWorkOrderInput {
  bookingRequestId: WorkOrder["bookingRequestId"];
  approvalId: string;
  actor: string;
}

export function createWorkOrder(
  deps: {
    workOrders: WorkOrderRepository;
    bookings: BookingRequestRepository;
    approvals: ApprovalRepository;
    auditEvents: AuditEventRepository;
  },
  input: CreateWorkOrderInput
): WorkOrder {
  if (!deps.bookings.findById(input.bookingRequestId)) {
    throw new UnknownBookingRequestError(input.bookingRequestId);
  }

  const approval = deps.approvals.findById(input.approvalId);
  if (!approval || approval.decision !== "approved") {
    writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "work_order.rejected",
      target: input.bookingRequestId,
      outcome: "rejected",
    });
    throw new ApprovalRequiredError(input.approvalId);
  }

  const workOrder: WorkOrder = {
    id: generateId("wo"),
    bookingRequestId: input.bookingRequestId,
    status: "created",
  };

  deps.workOrders.create(workOrder);
  writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "work_order.created",
    target: workOrder.id,
    outcome: "success",
  });

  return workOrder;
}
