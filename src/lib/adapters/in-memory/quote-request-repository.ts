import type { QuoteRequest } from "@/types/domain";
import type { QuoteRequestRepository } from "@/lib/adapters/types";

export function createInMemoryQuoteRequestRepository(): QuoteRequestRepository {
  const quoteRequests = new Map<string, QuoteRequest>();

  return {
    create(quoteRequest) {
      quoteRequests.set(quoteRequest.id, quoteRequest);
    },
    findById(id) {
      return quoteRequests.get(id);
    },
    findByService(serviceId) {
      return [...quoteRequests.values()].filter(
        (quoteRequest) => quoteRequest.serviceId === serviceId
      );
    },
    findByCustomer(customerId) {
      return [...quoteRequests.values()].filter(
        (quoteRequest) => quoteRequest.customerId === customerId
      );
    },
    clear() {
      quoteRequests.clear();
    },
  };
}
