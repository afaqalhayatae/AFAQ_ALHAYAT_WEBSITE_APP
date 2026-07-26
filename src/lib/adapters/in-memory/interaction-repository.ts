import type { Interaction } from "@/types/domain";
import type { InteractionRepository } from "@/lib/adapters/types";

export function createInMemoryInteractionRepository(): InteractionRepository {
  const interactions: Interaction[] = [];

  return {
    record(interaction) {
      interactions.push(interaction);
    },
    findByConsent(consentId) {
      return interactions.filter(
        (interaction) => interaction.consentId === consentId
      );
    },
    clear() {
      interactions.length = 0;
    },
  };
}
