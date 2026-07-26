import type { PasswordCredential } from "@/types/identity";
import type { CredentialRepository } from "@/lib/adapters/types";

export function createInMemoryCredentialRepository(): CredentialRepository {
  const credentials = new Map<string, PasswordCredential>();

  return {
    set(credential) {
      credentials.set(credential.userId, credential);
    },
    findByUserId(userId) {
      return credentials.get(userId);
    },
    clear() {
      credentials.clear();
    },
  };
}
