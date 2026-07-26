import type { BookingRequest } from "@/types/domain";
import type { BookingRequestRepository } from "@/lib/adapters/types";

export function createInMemoryBookingRequestRepository(): BookingRequestRepository {
  const bookingRequests = new Map<string, BookingRequest>();

  return {
    create(bookingRequest) {
      bookingRequests.set(bookingRequest.id, bookingRequest);
    },
    findById(id) {
      return bookingRequests.get(id);
    },
    findByService(serviceId) {
      return [...bookingRequests.values()].filter(
        (bookingRequest) => bookingRequest.serviceId === serviceId
      );
    },
    findByCustomer(customerId) {
      return [...bookingRequests.values()].filter(
        (bookingRequest) => bookingRequest.customerId === customerId
      );
    },
    clear() {
      bookingRequests.clear();
    },
  };
}
