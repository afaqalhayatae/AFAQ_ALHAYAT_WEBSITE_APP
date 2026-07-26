import type { Approval } from "@/types/domain";
import type { ApprovalRepository } from "@/lib/adapters/types";

export function createInMemoryApprovalRepository(): ApprovalRepository {
  const approvals = new Map<string, Approval>();

  return {
    create(approval) {
      approvals.set(approval.id, approval);
    },
    findById(id) {
      return approvals.get(id);
    },
    findByRiskLevel(riskLevel) {
      return [...approvals.values()].filter(
        (approval) => approval.riskLevel === riskLevel
      );
    },
    clear() {
      approvals.clear();
    },
  };
}
