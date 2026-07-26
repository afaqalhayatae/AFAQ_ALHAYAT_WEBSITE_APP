import type { Consent } from "@/types/domain";
import type { ConsentStore } from "@/lib/adapters/types";

export function createInMemoryConsentStore(): ConsentStore {
  const consents: Consent[] = [];

  return {
    record(consent) {
      consents.push(consent);
    },
    findByChannel(channel) {
      return consents.filter((consent) => consent.channel === channel);
    },
    clear() {
      consents.length = 0;
    },
  };
}
