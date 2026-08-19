import type { MatchProfile } from "./types";
import { students } from "./users";
import { sampleSchedules } from "./schedules";

const notes = [
  "Similar schedule",
  "Almost identical morning classes",
  "3 shared class days",
  "Matching start times",
  "Similar schedule",
  "Overlapping afternoon slots",
];

export const matches: MatchProfile[] = students
  .filter((s) => s.status === "active" && s.verified)
  .map((s, i) => ({
    id: `m-${i + 1}`,
    userId: s.id,
    name: s.name,
    gender: s.gender,
    pickupArea: s.pickupArea,
    rideType: s.rideType,
    verified: s.verified,
    score: [94, 91, 88, 84, 81, 77, 72][i] ?? 70,
    scheduleNote: notes[i % notes.length]!,
    sharedDays: ["Monday", "Wednesday", "Friday"],
    schedule: s.schedule.length ? s.schedule : sampleSchedules[0]!,
    phone: s.phone,
  }));
