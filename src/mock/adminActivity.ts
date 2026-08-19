import type { ActivityEvent } from "./types";

export const adminActivity: ActivityEvent[] = [
  {
    id: "a-1",
    action: "Admin suspended a user",
    admin: "Sara Malik",
    target: "Bilal Ahmed",
    date: "2026-08-18 10:42",
  },
  {
    id: "a-2",
    action: "Report resolved",
    admin: "Sara Malik",
    target: "RPT-1039",
    date: "2026-08-17 18:05",
  },
  { id: "a-3", action: "User verified", admin: "System", target: "Sana Javed", date: "2026-08-17 09:14" },
  { id: "a-4", action: "User banned", admin: "Omar Shah", target: "Danish Iqbal", date: "2026-08-16 16:30" },
  { id: "a-5", action: "Report dismissed", admin: "Omar Shah", target: "RPT-1038", date: "2026-08-15 11:52" },
  {
    id: "a-6",
    action: "Carpool connection created",
    admin: "System",
    target: "Ahmed Raza ↔ Mahnoor Ali",
    date: "2026-08-08 08:20",
  },
];

export const recentActivity = adminActivity.slice(0, 5);

export const adminProfile = {
  name: "Sara Malik",
  email: "moderation@fastcarpool.app",
  role: "Moderation Admin",
  lastLogin: "2026-08-19 09:12",
};

export const adminStats = [
  { label: "Total Users", value: "1,248" },
  { label: "Verified Students", value: "1,186" },
  { label: "Active Connections", value: "324" },
  { label: "Pending Reports", value: "12" },
  { label: "Suspended Accounts", value: "8" },
];
