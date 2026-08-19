import type { MatchProfile } from "@/mock/types";
import { matches } from "@/mock/matches";
import { delay, store } from "./store";

export const matchService = {
  async getMatches(): Promise<MatchProfile[]> {
    const visible = matches.filter((m) => !store.blocked.includes(m.name));
    return delay(visible.map((m) => ({ ...m })), 600);
  },
  async getMatch(id: string): Promise<MatchProfile> {
    const found = matches.find((m) => m.id === id);
    if (!found) throw new Error("This match is no longer available.");
    return delay({ ...found }, 400);
  },
};
