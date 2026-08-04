// Same pattern prisma.config.ts already uses — Vite/Vitest does not load
// .env into process.env automatically (only import.meta.env, VITE_-prefixed
// vars), so DATABASE_URL was invisible to the Prisma repository tests
// (Database Foundation Phase 1C) without this. Added here, not per-test-file,
// so every test process sees it the same way the Prisma CLI already does.
import "dotenv/config";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
