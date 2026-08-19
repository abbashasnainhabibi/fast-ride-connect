/**
 * In-memory mock store. This is the ONLY place that keeps mutable app state.
 * When a real Laravel REST API is available, the services in this folder can
 * swap these reads/writes for fetch() calls without touching the UI.
 */
import type {
  CarpoolRequest,
  ClassSlot,
  Connection,
  Report,
  StudentUser,
  ActivityEvent,
} from "@/mock/types";
import { currentUser, students } from "@/mock/users";
import { requests as seedRequests } from "@/mock/requests";
import { connections as seedConnections } from "@/mock/connections";
import { reports as seedReports } from "@/mock/reports";
import { adminActivity } from "@/mock/adminActivity";

export interface Session {
  role: "student" | "admin";
  email: string;
  verified: boolean;
  onboarded: boolean;
}

interface Store {
  session: Session | null;
  profile: StudentUser;
  students: StudentUser[];
  requests: CarpoolRequest[];
  connections: Connection[];
  reports: Report[];
  activity: ActivityEvent[];
  blocked: string[];
  pendingOtp: string;
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export const store: Store = {
  session: null,
  profile: clone(currentUser),
  students: clone(students),
  requests: clone(seedRequests),
  connections: clone(seedConnections),
  reports: clone(seedReports),
  activity: clone(adminActivity),
  blocked: [],
  pendingOtp: "123456",
};

const SESSION_KEY = "fast-carpool-session";

export function loadSession(): Session | null {
  if (store.session) return store.session;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw) store.session = JSON.parse(raw) as Session;
  } catch {
    /* ignore */
  }
  return store.session;
}

export function saveSession(session: Session | null) {
  store.session = session;
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
}

export function delay<T>(value: T, ms = 550): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function newSlot(partial: Partial<ClassSlot> = {}): ClassSlot {
  return {
    id: uid("slot"),
    day: partial.day ?? "Monday",
    start: partial.start ?? "08:00",
    end: partial.end ?? "09:30",
  };
}
