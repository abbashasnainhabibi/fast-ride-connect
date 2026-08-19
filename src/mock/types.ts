export type Gender = "male" | "female";
export type PartnerPreference = "anyone" | "male" | "female";
export type RideType = "offer" | "need" | "both";
export type AccountStatus = "active" | "suspended" | "banned";
export type RequestStatus = "pending" | "accepted" | "declined" | "cancelled";
export type ReportStatus = "pending" | "under_review" | "resolved" | "dismissed";
export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export interface ClassSlot {
  id: string;
  day: Day;
  start: string; // "08:00"
  end: string; // "09:30"
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  partnerPreference: PartnerPreference;
  rideType: RideType;
  pickupArea: string;
  phone: string;
  verified: boolean;
  status: AccountStatus;
  joinedAt: string;
  schedule: ClassSlot[];
  requestCount: number;
  connectionCount: number;
  reportsReceived: number;
}

export interface MatchProfile {
  id: string;
  userId: string;
  name: string;
  gender: Gender;
  pickupArea: string;
  rideType: RideType;
  verified: boolean;
  score: number;
  scheduleNote: string;
  sharedDays: Day[];
  schedule: ClassSlot[];
  phone: string;
}

export interface CarpoolRequest {
  id: string;
  direction: "sent" | "received";
  userId: string;
  name: string;
  gender: Gender;
  pickupArea: string;
  rideType: RideType;
  verified: boolean;
  scheduleNote: string;
  date: string;
  status: RequestStatus;
}

export interface Connection {
  id: string;
  userId: string;
  name: string;
  gender: Gender;
  pickupArea: string;
  rideType: RideType;
  phone: string;
  days: Day[];
  timeWindow: string;
  connectedAt: string;
}

export interface Report {
  id: string;
  reportedUserId: string;
  reportedUser: string;
  reporter: string;
  reason: string;
  description: string;
  date: string;
  status: ReportStatus;
  notes: string[];
}

export interface ActivityEvent {
  id: string;
  action: string;
  admin: string;
  target: string;
  date: string;
}

export const RIDE_TYPE_LABEL: Record<RideType, string> = {
  offer: "Offering a ride",
  need: "Needs a ride",
  both: "Offering or needing",
};

export const DAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const PICKUP_AREAS = [
  "North Nazimabad — Block C",
  "North Nazimabad — Dolmen Mall",
  "North Nazimabad — Five Star Chowrangi",
  "Nazimabad",
  "Gulshan-e-Iqbal",
  "PECHS",
  "Johar",
  "DHA",
];

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}
