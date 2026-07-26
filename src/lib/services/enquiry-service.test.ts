import { beforeEach, describe, expect, it } from "vitest";
import { submitEnquiry } from "./enquiry-service";
import { createInMemoryEnquiryRepository } from "@/lib/adapters/in-memory/enquiry-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import type { EnquiryRepository, AuditEventRepository } from "@/lib/adapters/types";

describe("submitEnquiry", () => {
  let enquiries: EnquiryRepository;
  let auditEvents: AuditEventRepository;

  beforeEach(() => {
    enquiries = createInMemoryEnquiryRepository();
    auditEvents = createInMemoryAuditEventRepository();
  });

  it("creates a new enquiry with status 'new' and an audit event", () => {
    const enquiry = submitEnquiry(
      { enquiries, auditEvents },
      {
        customerId: "cust-1",
        need: "test need",
        source: "test",
        actor: "test-actor",
      }
    );

    expect(enquiry.status).toBe("new");
    expect(enquiries.findById(enquiry.id)).toEqual(enquiry);
    expect(auditEvents.findByActor("test-actor")).toHaveLength(1);
    expect(auditEvents.findByActor("test-actor")[0].action).toBe(
      "enquiry.submitted"
    );
  });

  it("rejects a missing need", () => {
    expect(() =>
      submitEnquiry(
        { enquiries, auditEvents },
        { customerId: "cust-1", need: "", source: "test", actor: "test-actor" }
      )
    ).toThrow();
  });
});
