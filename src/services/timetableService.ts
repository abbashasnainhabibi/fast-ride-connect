import type { ClassSlot } from "@/mock/types";
import { extractedSchedule } from "@/mock/schedules";
import { delay, store } from "./store";

export const timetableService = {
  /** Mock "processing" — no OCR is performed. */
  async processUpload(file: { name: string; size: number }): Promise<ClassSlot[]> {
    if (file.size === 0) throw new Error("That file looks empty. Try another upload.");
    await delay(null, 1800);
    return extractedSchedule.map((s) => ({ ...s }));
  },
  async getSchedule(): Promise<ClassSlot[]> {
    return delay(store.profile.schedule.map((s) => ({ ...s })), 300);
  },
  async saveSchedule(slots: ClassSlot[]): Promise<ClassSlot[]> {
    store.profile = { ...store.profile, schedule: slots.map((s) => ({ ...s })) };
    return delay(store.profile.schedule.map((s) => ({ ...s })), 450);
  },
};
