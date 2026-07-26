import type { Session } from "@/types/identity";
import type { SessionRepository } from "@/lib/adapters/types";

export function createInMemorySessionRepository(): SessionRepository {
  const sessions = new Map<string, Session>();

  return {
    create(session) {
      sessions.set(session.id, session);
    },
    findById(id) {
      return sessions.get(id);
    },
    revoke(id) {
      sessions.delete(id);
    },
    clear() {
      sessions.clear();
    },
  };
}
