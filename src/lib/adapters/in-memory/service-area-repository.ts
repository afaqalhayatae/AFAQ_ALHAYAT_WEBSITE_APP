import type { ServiceArea } from "@/types/domain";
import type { ServiceAreaRepository } from "@/lib/adapters/types";

export function createInMemoryServiceAreaRepository(): ServiceAreaRepository {
  const areas = new Map<string, ServiceArea>();

  return {
    upsert(area) {
      areas.set(area.id, area);
    },
    findById(id) {
      return areas.get(id);
    },
    list() {
      return [...areas.values()];
    },
    clear() {
      areas.clear();
    },
  };
}
