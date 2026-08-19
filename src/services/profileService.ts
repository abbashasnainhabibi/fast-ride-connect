import type { StudentUser } from "@/mock/types";
import { delay, store } from "./store";

export const profileService = {
  async getProfile(): Promise<StudentUser> {
    return delay({ ...store.profile }, 350);
  },
  async updateProfile(patch: Partial<StudentUser>): Promise<StudentUser> {
    store.profile = { ...store.profile, ...patch };
    return delay({ ...store.profile }, 400);
  },
  async getBlockedUsers(): Promise<string[]> {
    return delay([...store.blocked], 250);
  },
  async blockUser(name: string): Promise<string[]> {
    if (!store.blocked.includes(name)) store.blocked.push(name);
    return delay([...store.blocked], 350);
  },
  async unblockUser(name: string): Promise<string[]> {
    store.blocked = store.blocked.filter((b) => b !== name);
    return delay([...store.blocked], 350);
  },
};
