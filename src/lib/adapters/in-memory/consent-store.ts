import type { Consent } from "@/types/domain";
import type { ConsentStore } from "@/lib/adapters/types";

export function createInMemoryConsentStore(): ConsentStore {
  const consents = new Map<string, Consent>();

  return {
    record(consent) {
      consents.set(consent.id, consent);
    },
    findById(id) {
      return consents.get(id);
    },
    findByChannel(channel) {
      return [...consents.values()].filter(
        (consent) => consent.channel === channel
      );
    },
    clear() {
      consents.clear();
    },
  };
}
