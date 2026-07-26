/**
 * Shared in-memory adapter instances for the Auth API boundary
 * (JOB-AGT-WEB-20260726-M2.1). A private folder (`_lib`) per Next.js
 * convention — not a route — so every sibling route under src/app/api/auth
 * shares the same repositories and password provider. No Prisma queries or
 * database connections here, matching the rest of the API boundary.
 */

import { createInMemoryUserRepository } from "@/lib/adapters/in-memory/user-repository";
import { createInMemoryCredentialRepository } from "@/lib/adapters/in-memory/credential-repository";
import { createInMemorySessionRepository } from "@/lib/adapters/in-memory/session-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import { createPasswordAuthProvider } from "@/lib/adapters/password/password-provider";

export const userRepository = createInMemoryUserRepository();
export const credentialRepository = createInMemoryCredentialRepository();
export const sessionRepository = createInMemorySessionRepository();
export const auditEventRepository = createInMemoryAuditEventRepository();
export const passwordProvider = createPasswordAuthProvider();
