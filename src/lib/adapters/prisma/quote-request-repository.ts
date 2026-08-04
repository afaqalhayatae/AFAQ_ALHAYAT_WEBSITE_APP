import type { QuoteRequest } from "@/types/domain";
import type { AsyncQuoteRequestRepository } from "./types";
import { prisma } from "./client";

// evidence is Json in schema.prisma (MySQL has no scalar array type) but
// string[] in the domain contract — same reasoning already documented in
// schema.prisma's QuoteRequest comment. Cast back on every read.
function toEvidenceArray(evidence: unknown): string[] {
  return evidence as string[];
}

export function createPrismaQuoteRequestRepository(): AsyncQuoteRequestRepository {
  return {
    async create(quoteRequest) {
      await prisma.quoteRequest.create({
        data: {
          id: quoteRequest.id,
          customerId: quoteRequest.customerId,
          serviceId: quoteRequest.serviceId,
          requirements: quoteRequest.requirements,
          evidence: quoteRequest.evidence,
        },
      });
    },
    async findById(id) {
      const record = await prisma.quoteRequest.findUnique({ where: { id } });
      if (!record) return undefined;
      return { ...record, evidence: toEvidenceArray(record.evidence) } as QuoteRequest;
    },
    async findByService(serviceId) {
      const records = await prisma.quoteRequest.findMany({ where: { serviceId } });
      return records.map((record) => ({
        ...record,
        evidence: toEvidenceArray(record.evidence),
      })) as QuoteRequest[];
    },
    async findByCustomer(customerId) {
      const records = await prisma.quoteRequest.findMany({ where: { customerId } });
      return records.map((record) => ({
        ...record,
        evidence: toEvidenceArray(record.evidence),
      })) as QuoteRequest[];
    },
    async clear() {
      await prisma.quoteRequest.deleteMany();
    },
  };
}
