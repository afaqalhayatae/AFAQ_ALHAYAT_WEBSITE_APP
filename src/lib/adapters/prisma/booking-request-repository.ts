import type { BookingRequest } from "@/types/domain";
import type { AsyncBookingRequestRepository } from "./types";
import { prisma } from "./client";

// Prisma's generated model type widens ServiceId/ServiceAreaId's branded
// template-literal types (`SVC-${string}`, `LOC-AE-${string}`) to plain
// string — the column really does only ever hold values in that shape
// (enforced at the catalog layer, per DATA_MODEL.md), so this cast is safe,
// same reasoning already applied to QuoteRequest.evidence.
export function createPrismaBookingRequestRepository(): AsyncBookingRequestRepository {
  return {
    async create(bookingRequest) {
      await prisma.bookingRequest.create({ data: bookingRequest });
    },
    async findById(id) {
      const record = await prisma.bookingRequest.findUnique({ where: { id } });
      return (record ?? undefined) as BookingRequest | undefined;
    },
    async findByService(serviceId) {
      const records = await prisma.bookingRequest.findMany({ where: { serviceId } });
      return records as BookingRequest[];
    },
    async findByCustomer(customerId) {
      const records = await prisma.bookingRequest.findMany({ where: { customerId } });
      return records as BookingRequest[];
    },
    async clear() {
      await prisma.bookingRequest.deleteMany();
    },
  };
}
