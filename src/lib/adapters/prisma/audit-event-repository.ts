import type { AsyncAuditEventRepository } from "./types";
import { prisma } from "./client";

export function createPrismaAuditEventRepository(): AsyncAuditEventRepository {
  return {
    async record(event) {
      await prisma.auditEvent.create({
        data: {
          id: event.id,
          actor: event.actor,
          action: event.action,
          target: event.target,
          outcome: event.outcome,
          timestamp: new Date(event.timestamp),
          correlationId: event.correlationId,
        },
      });
    },
    async findByActor(actor) {
      // orderBy is required here — a bare findMany has no guaranteed
      // return order in MySQL/Prisma, unlike the in-memory adapter, which
      // naturally preserves insertion order by filtering a plain array.
      // Found by a real failing test (Database Foundation Phase 1J's
      // ordering/timestamp verification), not assumed in advance.
      const records = await prisma.auditEvent.findMany({
        where: { actor },
        orderBy: { timestamp: "asc" },
      });
      return records.map((record) => ({
        ...record,
        timestamp: record.timestamp.toISOString(),
      }));
    },
    async clear() {
      await prisma.auditEvent.deleteMany();
    },
  };
}
