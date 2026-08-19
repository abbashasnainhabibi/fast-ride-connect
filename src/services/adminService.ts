import type { AccountStatus, ActivityEvent, Report, ReportStatus, StudentUser } from "@/mock/types";
import { adminProfile, adminStats } from "@/mock/adminActivity";
import { delay, store, uid } from "./store";

function logActivity(action: string, target: string) {
  const event: ActivityEvent = {
    id: uid("a"),
    action,
    admin: adminProfile.name,
    target,
    date: new Date().toISOString().slice(0, 16).replace("T", " "),
  };
  store.activity = [event, ...store.activity];
}

export const adminService = {
  async getStats() {
    return delay(adminStats.map((s) => ({ ...s })), 400);
  },
  async getUsers(): Promise<StudentUser[]> {
    return delay(store.students.map((u) => ({ ...u })), 550);
  },
  async getUser(id: string): Promise<StudentUser> {
    const user = store.students.find((u) => u.id === id);
    if (!user) throw new Error("User not found.");
    return delay({ ...user }, 400);
  },
  async setUserStatus(id: string, status: AccountStatus): Promise<StudentUser> {
    const user = store.students.find((u) => u.id === id);
    if (!user) throw new Error("User not found.");
    user.status = status;
    const verb =
      status === "suspended"
        ? "Admin suspended a user"
        : status === "banned"
          ? "User banned"
          : "Account restored";
    logActivity(verb, user.name);
    return delay({ ...user }, 500);
  },
  async getReports(): Promise<Report[]> {
    return delay(store.reports.map((r) => ({ ...r })), 500);
  },
  async getReport(id: string): Promise<Report> {
    const report = store.reports.find((r) => r.id === id);
    if (!report) throw new Error("Report not found.");
    return delay({ ...report }, 400);
  },
  async setReportStatus(id: string, status: ReportStatus): Promise<Report> {
    const report = store.reports.find((r) => r.id === id);
    if (!report) throw new Error("Report not found.");
    report.status = status;
    logActivity(
      status === "resolved"
        ? "Report resolved"
        : status === "dismissed"
          ? "Report dismissed"
          : "Report marked under review",
      report.id,
    );
    return delay({ ...report }, 500);
  },
  async addNote(id: string, note: string): Promise<Report> {
    const report = store.reports.find((r) => r.id === id);
    if (!report) throw new Error("Report not found.");
    report.notes = [...report.notes, note];
    return delay({ ...report }, 400);
  },
  async getSuspendedUsers(): Promise<StudentUser[]> {
    return delay(
      store.students.filter((u) => u.status === "suspended").map((u) => ({ ...u })),
      450,
    );
  },
  async getActivity(): Promise<ActivityEvent[]> {
    return delay(store.activity.map((a) => ({ ...a })), 450);
  },
  async getProfile() {
    return delay({ ...adminProfile }, 300);
  },
};
