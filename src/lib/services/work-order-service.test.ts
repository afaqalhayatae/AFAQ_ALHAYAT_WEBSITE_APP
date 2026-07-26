import { beforeEach, describe, expect, it } from "vitest";
import { createWorkOrder } from "./work-order-service";
import {
  ApprovalRequiredError,
  ApprovalTargetMismatchError,
  UnknownBookingRequestError,
} from "./errors";
import { createInMemoryBookingRequestRepository } from "@/lib/adapters/in-memory/booking-request-repository";
import { createInMemoryApprovalRepository } from "@/lib/adapters/in-memory/approval-repository";
import { createInMemoryWorkOrderRepository } from "@/lib/adapters/in-memory/work-order-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import type {
  BookingRequestRepository,
  ApprovalRepository,
  WorkOrderRepository,
  AuditEventRepository,
} from "@/lib/adapters/types";

describe("createWorkOrder", () => {
  let bookings: BookingRequestRepository;
  let approvals: ApprovalRepository;
  let workOrders: WorkOrderRepository;
  let auditEvents: AuditEventRepository;

  beforeEach(() => {
    bookings = createInMemoryBookingRequestRepository();
    approvals = createInMemoryApprovalRepository();
    workOrders = createInMemoryWorkOrderRepository();
    auditEvents = createInMemoryAuditEventRepository();
    bookings.create({
      id: "book-1",
      serviceId: "SVC-TEST-SERVICE",
      serviceAreaId: "LOC-AE-TEST",
      schedulePreference: "test preference",
      status: "requested",
    });
  });

  it("creates a work order when the approval is approved and targets the exact booking request", () => {
    approvals.create({
      id: "appr-1",
      action: "work_order.create",
      targetType: "BookingRequest",
      targetId: "book-1",
      riskLevel: "A2",
      requester: "test-agent",
      decision: "approved",
      evidence: "test-fixture",
      expiresAt: "2099-01-01T00:00:00.000Z",
    });

    const workOrder = createWorkOrder(
      { bookings, approvals, workOrders, auditEvents },
      { bookingRequestId: "book-1", approvalId: "appr-1", actor: "test-actor" }
    );

    expect(workOrder.status).toBe("created");
    expect(workOrders.findById(workOrder.id)).toEqual(workOrder);
  });

  it("rejects when the approval targets a different booking request", () => {
    bookings.create({
      id: "book-2",
      serviceId: "SVC-TEST-SERVICE",
      serviceAreaId: "LOC-AE-TEST",
      schedulePreference: "test preference",
      status: "requested",
    });
    approvals.create({
      id: "appr-1",
      action: "work_order.create",
      targetType: "BookingRequest",
      targetId: "book-2",
      riskLevel: "A2",
      requester: "test-agent",
      decision: "approved",
      evidence: "test-fixture",
      expiresAt: "2099-01-01T00:00:00.000Z",
    });

    expect(() =>
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "book-1", approvalId: "appr-1", actor: "test-actor" }
      )
    ).toThrow(ApprovalTargetMismatchError);
    expect(auditEvents.findByActor("test-actor")[0].outcome).toBe("rejected");
  });

  it("rejects when the approval targets a different target type", () => {
    approvals.create({
      id: "appr-1",
      action: "work_order.create",
      targetType: "WorkOrder",
      targetId: "book-1",
      riskLevel: "A2",
      requester: "test-agent",
      decision: "approved",
      evidence: "test-fixture",
      expiresAt: "2099-01-01T00:00:00.000Z",
    });

    expect(() =>
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "book-1", approvalId: "appr-1", actor: "test-actor" }
      )
    ).toThrow(ApprovalTargetMismatchError);
  });

  it("rejects an unknown booking request", () => {
    expect(() =>
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "missing", approvalId: "appr-1", actor: "test-actor" }
      )
    ).toThrow(UnknownBookingRequestError);
  });

  it("rejects when the approval is missing", () => {
    expect(() =>
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "book-1", approvalId: "missing", actor: "test-actor" }
      )
    ).toThrow(ApprovalRequiredError);
  });

  it("rejects when the approval is still pending", () => {
    approvals.create({
      id: "appr-1",
      action: "work_order.create",
      targetType: "BookingRequest",
      targetId: "book-1",
      riskLevel: "A2",
      requester: "test-agent",
      decision: "pending",
      evidence: "test-fixture",
      expiresAt: "2099-01-01T00:00:00.000Z",
    });

    expect(() =>
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "book-1", approvalId: "appr-1", actor: "test-actor" }
      )
    ).toThrow(ApprovalRequiredError);
    expect(auditEvents.findByActor("test-actor")[0].outcome).toBe("rejected");
  });
});
