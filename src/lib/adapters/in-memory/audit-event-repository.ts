import type { AuditEvent } from "@/types/domain";
import type { AuditEventRepository } from "@/lib/adapters/types";

export function createInMemoryAuditEventRepository(): AuditEventRepository {
  const events: AuditEvent[] = [];

  return {
    record(event) {
      events.push(event);
    },
    findByActor(actor) {
      return events.filter((event) => event.actor === actor);
    },
    clear() {
      events.length = 0;
    },
  };
}
