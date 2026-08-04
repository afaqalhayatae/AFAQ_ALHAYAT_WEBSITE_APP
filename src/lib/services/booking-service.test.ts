import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { requestBooking } from "./booking-service";
import { UnknownServiceAreaError, UnknownServiceError } from "./errors";
import { createInMemoryServiceRepository } from "@/lib/adapters/in-memory/service-repository";
import { createInMemoryServiceAreaRepository } from "@/lib/adapters/in-memory/service-area-repository";
import {
  getAuditEventRepository,
  getBookingRequestRepository,
  getCustomerRepository,
} from "@/lib/adapters/repository-factory";
import { prisma } from "@/lib/adapters/prisma/client";
import type { ServiceRepository, ServiceAreaRepository } from "@/lib/adapters/types";
import type {
  AsyncAuditEventRepository,
  AsyncBookingRequestRepository,
  AsyncCustomerRepository,
} from "@/lib/adapters/prisma/types";

// Runs the real requestBooking service function against both drivers the
// repository factory can select (Database Foundation Phase 1H). The
// "memory" block below is what every deployed environment uses today,
// unchanged; the "prisma" block proves the same service function produces
// identical results against a real database, gated on a reachable local
// DATABASE_URL so this suite still runs without Docker. services/
// serviceAreas stay the plain in-memory adapters throughout — untouched,
// out of this phase's scope.
function makeSuite(driver: "memory" | "prisma") {
  describe(`requestBooking (${driver} driver)`, () => {
    let services: ServiceRepository;
    let serviceAreas: ServiceAreaRepository;
    let bookings: AsyncBookingRequestRepository;
    let auditEvents: AsyncAuditEventRepository;
    const originalDriver = process.env.REPOSITORY_DRIVER;

    beforeEach(() => {
      process.env.REPOSITORY_DRIVER = driver;
      services = createInMemoryServiceRepository();
      serviceAreas = createInMemoryServiceAreaRepository();
      bookings = getBookingRequestRepository();
      auditEvents = getAuditEventRepository();
      services.upsert({ id: "SVC-TEST-SERVICE" });
      serviceAreas.upsert({ id: "LOC-AE-TEST" });
    });

    afterEach(async () => {
      if (originalDriver === undefined) {
        delete process.env.REPOSITORY_DRIVER;
      } else {
        process.env.REPOSITORY_DRIVER = originalDriver;
      }
      await bookings.clear();
      await auditEvents.clear();
    });

    it("creates a booking request at status 'requested'", async () => {
      const bookingRequest = await requestBooking(
        { services, serviceAreas, bookings, auditEvents },
        {
          customerId: "cust-1",
          serviceId: "SVC-TEST-SERVICE",
          serviceAreaId: "LOC-AE-TEST",
          schedulePreference: "weekday mornings",
          actor: "test-actor",
        }
      );

      expect(bookingRequest.status).toBe("requested");
      expect(bookingRequest.customerId).toBe("cust-1");
      await expect(bookings.findById(bookingRequest.id)).resolves.toEqual(bookingRequest);
    });

    it("rejects a missing customerId", async () => {
      await expect(
        requestBooking(
          { services, serviceAreas, bookings, auditEvents },
          {
            customerId: "",
            serviceId: "SVC-TEST-SERVICE",
            serviceAreaId: "LOC-AE-TEST",
            schedulePreference: "weekday mornings",
            actor: "test-actor",
          }
        )
      ).rejects.toThrow();
    });

    it("rejects an unknown service", async () => {
      await expect(
        requestBooking(
          { services, serviceAreas, bookings, auditEvents },
          {
            customerId: "cust-1",
            serviceId: "SVC-MISSING",
            serviceAreaId: "LOC-AE-TEST",
            schedulePreference: "weekday mornings",
            actor: "test-actor",
          }
        )
      ).rejects.toThrow(UnknownServiceError);
    });

    it("rejects an unknown service area", async () => {
      await expect(
        requestBooking(
          { services, serviceAreas, bookings, auditEvents },
          {
            customerId: "cust-1",
            serviceId: "SVC-TEST-SERVICE",
            serviceAreaId: "LOC-AE-MISSING",
            schedulePreference: "weekday mornings",
            actor: "test-actor",
          }
        )
      ).rejects.toThrow(UnknownServiceAreaError);
    });
  });
}

makeSuite("memory");
describe.skipIf(!process.env.DATABASE_URL)("prisma driver suite", () => {
  makeSuite("prisma");

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

// Data consistency check: the same input, requested once per driver,
// round-trips to an identical BookingRequest shape from both backends.
describe.skipIf(!process.env.DATABASE_URL)(
  "BookingRequest data consistency across drivers",
  () => {
    const originalDriver = process.env.REPOSITORY_DRIVER;
    const services = createInMemoryServiceRepository();
    const serviceAreas = createInMemoryServiceAreaRepository();
    const auditEvents = getAuditEventRepository();

    beforeEach(() => {
      services.upsert({ id: "SVC-CONSISTENCY-SERVICE" });
      serviceAreas.upsert({ id: "LOC-AE-CONSISTENCY" });
    });

    afterEach(async () => {
      if (originalDriver === undefined) {
        delete process.env.REPOSITORY_DRIVER;
      } else {
        process.env.REPOSITORY_DRIVER = originalDriver;
      }
      await auditEvents.clear();
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    it("produces the same BookingRequest shape from memory and prisma for identical input", async () => {
      const input = {
        customerId: "cust-consistency-1",
        serviceId: "SVC-CONSISTENCY-SERVICE" as const,
        serviceAreaId: "LOC-AE-CONSISTENCY" as const,
        schedulePreference: "weekday mornings",
        actor: "test-actor",
      };

      process.env.REPOSITORY_DRIVER = "memory";
      const memoryBookings = getBookingRequestRepository();
      const memoryBooking = await requestBooking(
        { services, serviceAreas, bookings: memoryBookings, auditEvents },
        input
      );

      process.env.REPOSITORY_DRIVER = "prisma";
      const prismaBookings = getBookingRequestRepository();
      const prismaBooking = await requestBooking(
        { services, serviceAreas, bookings: prismaBookings, auditEvents },
        input
      );
      await prismaBookings.clear();

      // ids are independently generated (generateId), so compare
      // everything else — the actual shape a caller (the /api/bookings and
      // /api/booking-requests routes) receives.
      expect(memoryBooking.customerId).toBe(prismaBooking.customerId);
      expect(memoryBooking.serviceId).toBe(prismaBooking.serviceId);
      expect(memoryBooking.serviceAreaId).toBe(prismaBooking.serviceAreaId);
      expect(memoryBooking.schedulePreference).toBe(prismaBooking.schedulePreference);
      expect(memoryBooking.status).toBe(prismaBooking.status);
    });
  }
);

// Relation test: BookingRequest.customerId referencing a real Customer,
// both migrated entities (Phase 1G, Phase 1H) resolved under the SAME
// driver — proves the "Customer + BookingRequest repositories resolve with
// the same driver" requirement isn't just true by inspection of the
// factory's shared env-var read, but actually holds end-to-end when a
// booking is created for a customer that only exists in that same backend.
describe.skipIf(!process.env.DATABASE_URL)(
  "Customer + BookingRequest relation, same driver",
  () => {
    const originalDriver = process.env.REPOSITORY_DRIVER;
    const services = createInMemoryServiceRepository();
    const serviceAreas = createInMemoryServiceAreaRepository();
    const auditEvents = getAuditEventRepository();

    beforeEach(() => {
      process.env.REPOSITORY_DRIVER = "prisma";
      services.upsert({ id: "SVC-RELATION-SERVICE" });
      serviceAreas.upsert({ id: "LOC-AE-RELATION" });
    });

    afterEach(async () => {
      if (originalDriver === undefined) {
        delete process.env.REPOSITORY_DRIVER;
      } else {
        process.env.REPOSITORY_DRIVER = originalDriver;
      }
      await prisma.contactPoint.deleteMany();
      await prisma.customer.deleteMany();
      await prisma.bookingRequest.deleteMany();
      await auditEvents.clear();
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    it("creates a real Prisma Customer, then a BookingRequest referencing it, both via the factory", async () => {
      const customers: AsyncCustomerRepository = getCustomerRepository();
      const bookings: AsyncBookingRequestRepository = getBookingRequestRepository();

      const customer = {
        id: "cust-relation-1",
        contactPoints: [{ channel: "phone" as const, value: "+971500000099" }],
      };
      await customers.create(customer);

      const bookingRequest = await requestBooking(
        { services, serviceAreas, bookings, auditEvents },
        {
          customerId: customer.id,
          serviceId: "SVC-RELATION-SERVICE",
          serviceAreaId: "LOC-AE-RELATION",
          schedulePreference: "weekday mornings",
          actor: "test-actor",
        }
      );

      expect(bookingRequest.customerId).toBe(customer.id);
      // No enforced foreign key (schema.prisma's own deliberate design,
      // restated in 08_REPOSITORY_SWITCHOVER_PLAN.md §5) — this confirms
      // the reference is consistent by value, not by a DB-level constraint
      // that doesn't exist.
      const storedCustomer = await customers.findById(bookingRequest.customerId);
      expect(storedCustomer?.id).toBe(customer.id);

      const rawBooking = await prisma.bookingRequest.findUnique({
        where: { id: bookingRequest.id },
      });
      expect(rawBooking?.customerId).toBe(customer.id);
    });
  }
);
