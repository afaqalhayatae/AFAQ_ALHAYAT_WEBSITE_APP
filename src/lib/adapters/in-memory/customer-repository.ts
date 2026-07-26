import type { Customer } from "@/types/domain";
import type { CustomerRepository } from "@/lib/adapters/types";

export function createInMemoryCustomerRepository(): CustomerRepository {
  const customers = new Map<string, Customer>();

  return {
    create(customer) {
      customers.set(customer.id, customer);
    },
    findById(id) {
      return customers.get(id);
    },
    clear() {
      customers.clear();
    },
  };
}
