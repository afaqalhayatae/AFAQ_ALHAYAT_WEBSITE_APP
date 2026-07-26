import type { User } from "@/types/identity";
import type { UserRepository } from "@/lib/adapters/types";

export function createInMemoryUserRepository(): UserRepository {
  const users = new Map<string, User>();

  return {
    create(user) {
      users.set(user.id, user);
    },
    findById(id) {
      return users.get(id);
    },
    findByContact(channel, value) {
      return [...users.values()].find(
        (user) => user.contact.channel === channel && user.contact.value === value
      );
    },
    update(user) {
      users.set(user.id, user);
    },
    clear() {
      users.clear();
    },
  };
}
