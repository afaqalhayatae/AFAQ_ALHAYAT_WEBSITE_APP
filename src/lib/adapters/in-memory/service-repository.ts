import type { Service } from "@/types/domain";
import type { ServiceRepository } from "@/lib/adapters/types";

export function createInMemoryServiceRepository(): ServiceRepository {
  const services = new Map<string, Service>();

  return {
    upsert(service) {
      services.set(service.id, service);
    },
    findById(id) {
      return services.get(id);
    },
    list() {
      return [...services.values()];
    },
    clear() {
      services.clear();
    },
  };
}
