import type { AsyncCustomerRepository } from "./types";
import { prisma } from "./client";

export function createPrismaCustomerRepository(): AsyncCustomerRepository {
  return {
    async create(customer) {
      await prisma.customer.create({
        data: {
          id: customer.id,
          contactPoints: {
            create: customer.contactPoints.map((point) => ({
              channel: point.channel,
              value: point.value,
            })),
          },
        },
      });
    },
    async findById(id) {
      const record = await prisma.customer.findUnique({
        where: { id },
        include: { contactPoints: { select: { channel: true, value: true } } },
      });
      if (!record) return undefined;
      return { id: record.id, contactPoints: record.contactPoints };
    },
    async clear() {
      // ContactPoint rows must go first — no cascade delete is declared
      // (schema.prisma keeps IDs as references, not enforced FKs, except
      // this one Customer/ContactPoint relation, which has no onDelete rule).
      await prisma.contactPoint.deleteMany();
      await prisma.customer.deleteMany();
    },
  };
}
