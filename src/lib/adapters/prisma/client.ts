/**
 * Shared PrismaClient singleton (Database Foundation Phase 1C). Prisma's
 * own documented pattern for Next.js: without this, each dev hot-reload
 * would create a new client and a new connection pool, eventually
 * exhausting the database's connection limit. Every Prisma-backed adapter
 * in this directory imports `prisma` from here — never instantiate
 * PrismaClient anywhere else.
 *
 * Prisma 7's `prisma-client` generator (used by this schema) requires an
 * explicit driver adapter — unlike the classic client, it does not read
 * DATABASE_URL from the datasource block at runtime (only the CLI/migrate
 * side does, via prisma.config.ts). @prisma/adapter-mariadb is the correct
 * driver for MySQL/MariaDB in this generator, found and installed during
 * Phase 1C after `new PrismaClient()` failed typecheck with "Expected 1
 * argument, but got 0" — not a pre-existing decision, a real requirement
 * discovered while wiring this up.
 */
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "");

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
