import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createWorkOrder } from "./work-order-service";
import {
  ApprovalRequiredError,
  ApprovalTargetMismatchError,
  UnknownBookingRequestError,
} from "./errors";
import { createInMemoryBookingRequestRepository } from "@/lib/adapters/in-memory/booking-request-repository";
import { createInMemoryApprovalRepository } from "@/lib/adapters/in-memory/approval-repository";
import { createInMemoryWorkOrderRepository } from "@/lib/adapters/in-memory/work-order-repository";
import { getAuditEventRepository } from "@/lib/adapters/repository-factory";
import type {
  BookingRequestRepository,
  ApprovalRepository,
  WorkOrderRepository,
} from "@/lib/adapters/types";
import type { AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";

// Database Foundation Phase 1J — AuditEvent switchover. createWorkOrder
// became async purely as a consequence of writeAuditEvent's signature
// change — no approval/work-order logic changed. bookings/approvals/
// workOrders stay the existing synchronous repositories, untouched (this
// function is never wired to a live route).
describe("createWorkOrder", () => {
  let bookings: BookingRequestRepository;
  let approvals: ApprovalRepository;
  let workOrders: WorkOrderRepository;
  let auditEvents: AsyncAuditEventRepository;

  beforeEach(() => {
    bookings = createInMemoryBookingRequestRepository();
    approvals = createInMemoryApprovalRepository();
    workOrders = createInMemoryWorkOrderRepository();
    auditEvents = getAuditEventRepository();
    bookings.create({
      id: "book-1",
      customerId: "cust-1",
      serviceId: "SVC-TEST-SERVICE",
      serviceAreaId: "LOC-AE-TEST",
      schedulePreference: "test preference",
      status: "requested",
    });
  });

  afterEach(async () => {
    await auditEvents.clear();
  });

  it("creates a work order when the approval is approved and targets the exact booking request", async () => {
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

    const workOrder = await createWorkOrder(
      { bookings, approvals, workOrders, auditEvents },
      { bookingRequestId: "book-1", approvalId: "appr-1", actor: "test-actor" }
    );

    expect(workOrder.status).toBe("created");
    expect(workOrders.findById(workOrder.id)).toEqual(workOrder);
  });

  it("rejects when the approval targets a different booking request", async () => {
    bookings.create({
      id: "book-2",
      customerId: "cust-1",
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

    await expect(
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "book-1", approvalId: "appr-1", actor: "test-actor" }
      )
    ).rejects.toThrow(ApprovalTargetMismatchError);
    const events = await auditEvents.findByActor("test-actor");
    expect(events[0].outcome).toBe("rejected");
  });

  it("rejects when the approval targets a different target type", async () => {
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

    await expect(
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "book-1", approvalId: "appr-1", actor: "test-actor" }
      )
    ).rejects.toThrow(ApprovalTargetMismatchError);
  });

  it("rejects an unknown booking request", async () => {
    await expect(
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "missing", approvalId: "appr-1", actor: "test-actor" }
      )
    ).rejects.toThrow(UnknownBookingRequestError);
  });

  it("rejects when the approval is missing", async () => {
    await expect(
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "book-1", approvalId: "missing", actor: "test-actor" }
      )
    ).rejects.toThrow(ApprovalRequiredError);
  });

  it("rejects when the approval is still pending", async () => {
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

    await expect(
      createWorkOrder(
        { bookings, approvals, workOrders, auditEvents },
        { bookingRequestId: "book-1", approvalId: "appr-1", actor: "test-actor" }
      )
    ).rejects.toThrow(ApprovalRequiredError);
    const events = await auditEvents.findByActor("test-actor");
    expect(events[0].outcome).toBe("rejected");
  });
});
