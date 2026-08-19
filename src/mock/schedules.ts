import type { ClassSlot, Day } from "./types";

let counter = 0;
export function slot(day: Day, start: string, end: string): ClassSlot {
  counter += 1;
  return { id: `slot-${counter}`, day, start, end };
}

export const currentUserSchedule: ClassSlot[] = [
  slot("Monday", "08:00", "09:30"),
  slot("Monday", "10:00", "11:30"),
  slot("Tuesday", "09:30", "11:00"),
  slot("Wednesday", "08:00", "09:30"),
  slot("Thursday", "10:00", "11:30"),
  slot("Friday", "08:00", "09:30"),
];

export const extractedSchedule: ClassSlot[] = [
  slot("Monday", "08:00", "09:30"),
  slot("Monday", "10:00", "11:30"),
  slot("Tuesday", "09:30", "11:00"),
  slot("Wednesday", "08:00", "09:30"),
  slot("Thursday", "10:00", "11:30"),
  slot("Friday", "08:00", "09:30"),
];

export const sampleSchedules: ClassSlot[][] = [
  [
    slot("Monday", "08:00", "09:30"),
    slot("Tuesday", "09:30", "11:00"),
    slot("Wednesday", "08:00", "09:30"),
  ],
  [
    slot("Monday", "10:00", "11:30"),
    slot("Wednesday", "10:00", "11:30"),
    slot("Friday", "08:00", "09:30"),
  ],
  [
    slot("Tuesday", "08:00", "09:30"),
    slot("Thursday", "10:00", "11:30"),
    slot("Friday", "11:30", "13:00"),
  ],
];
