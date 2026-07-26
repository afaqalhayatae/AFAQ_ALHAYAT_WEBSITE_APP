/**
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Status: Approved, v0.2). Work Order:
 * "created only by an approved operational workflow"; it "must reference
 * the Approval that authorized its creation." createWorkOrder refuses
 * unless the referenced Approval exists, is decision "approved", AND its
 * targetType/targetId match the exact BookingRequest being fulfilled — a
 * generically-approved record (approved for something else) is rejected,
 * per the Rules section's target-binding rule. This function never decides
 * the approval itself.
 *
 * The approval's target is the BookingRequest, not the WorkOrder — a
 * WorkOrder has no id until after it's created, so it cannot be the target
 * of an approval requested beforehand.
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
  ApprovalTargetMismatchError,
  UnknownBookingRequestError,
} from "./errors";

const WORK_ORDER_APPROVAL_TARGET_TYPE = "BookingRequest";

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

  if (
    approval.targetType !== WORK_ORDER_APPROVAL_TARGET_TYPE ||
    approval.targetId !== input.bookingRequestId
  ) {
    writeAuditEvent(deps.auditEvents, {
      actor: input.actor,
      action: "work_order.rejected",
      target: input.bookingRequestId,
      outcome: "rejected",
    });
    throw new ApprovalTargetMismatchError(approval.id, input.bookingRequestId);
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
