import type { Consent } from "@/types/domain";
import type { AsyncConsentStore } from "./types";
import { prisma } from "./client";

function toDomain(record: {
  id: string;
  channel: string;
  purpose: string;
  status: string;
  source: string;
  evidence: string;
  recordedAt: Date;
}): Consent {
  return {
    id: record.id,
    channel: record.channel as Consent["channel"],
    purpose: record.purpose,
    status: record.status as Consent["status"],
    source: record.source,
    evidence: record.evidence,
    recordedAt: record.recordedAt.toISOString(),
  };
}

export function createPrismaConsentStore(): AsyncConsentStore {
  return {
    async record(consent) {
      await prisma.consent.create({
        data: {
          id: consent.id,
          channel: consent.channel,
          purpose: consent.purpose,
          status: consent.status,
          source: consent.source,
          evidence: consent.evidence,
          recordedAt: new Date(consent.recordedAt),
        },
      });
    },
    async findById(id) {
      const record = await prisma.consent.findUnique({ where: { id } });
      return record ? toDomain(record) : undefined;
    },
    async findByChannel(channel) {
      const records = await prisma.consent.findMany({ where: { channel } });
      return records.map(toDomain);
    },
    async clear() {
      await prisma.consent.deleteMany();
    },
  };
}
