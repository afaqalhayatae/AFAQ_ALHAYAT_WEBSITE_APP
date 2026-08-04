import type { AsyncEnquiryRepository } from "./types";
import { prisma } from "./client";

export function createPrismaEnquiryRepository(): AsyncEnquiryRepository {
  return {
    async create(enquiry) {
      await prisma.enquiry.create({ data: enquiry });
    },
    async findById(id) {
      const record = await prisma.enquiry.findUnique({ where: { id } });
      return record ?? undefined;
    },
    async findByCustomer(customerId) {
      return prisma.enquiry.findMany({ where: { customerId } });
    },
    async clear() {
      await prisma.enquiry.deleteMany();
    },
  };
}
