import type { Connection } from "./types";

export const connections: Connection[] = [
  {
    id: "c-1",
    userId: "u-7",
    name: "Mahnoor Ali",
    gender: "female",
    pickupArea: "North Nazimabad — Block C",
    rideType: "both",
    phone: "+92 334 2211009",
    days: ["Monday", "Wednesday", "Friday"],
    timeWindow: "07:30 AM departure · 12:00 PM return",
    connectedAt: "2026-08-08",
  },
  {
    id: "c-2",
    userId: "u-1",
    name: "Ayesha Khan",
    gender: "female",
    pickupArea: "North Nazimabad — Dolmen Mall",
    rideType: "offer",
    phone: "+92 301 4455661",
    days: ["Tuesday", "Thursday"],
    timeWindow: "09:00 AM departure · 02:00 PM return",
    connectedAt: "2026-07-21",
  },
];
