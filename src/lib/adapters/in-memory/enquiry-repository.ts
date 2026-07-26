import type { Enquiry } from "@/types/domain";
import type { EnquiryRepository } from "@/lib/adapters/types";

export function createInMemoryEnquiryRepository(): EnquiryRepository {
  const enquiries = new Map<string, Enquiry>();

  return {
    create(enquiry) {
      enquiries.set(enquiry.id, enquiry);
    },
    findById(id) {
      return enquiries.get(id);
    },
    findByCustomer(customerId) {
      return [...enquiries.values()].filter(
        (enquiry) => enquiry.customerId === customerId
      );
    },
    clear() {
      enquiries.clear();
    },
  };
}
