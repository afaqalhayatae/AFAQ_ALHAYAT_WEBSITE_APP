import type { WorkOrder } from "@/types/domain";
import type { WorkOrderRepository } from "@/lib/adapters/types";

export function createInMemoryWorkOrderRepository(): WorkOrderRepository {
  const workOrders = new Map<string, WorkOrder>();

  return {
    create(workOrder) {
      workOrders.set(workOrder.id, workOrder);
    },
    findById(id) {
      return workOrders.get(id);
    },
    findByBookingRequest(bookingRequestId) {
      return [...workOrders.values()].filter(
        (workOrder) => workOrder.bookingRequestId === bookingRequestId
      );
    },
    clear() {
      workOrders.clear();
    },
  };
}
