import type { Report } from "@/mock/types";
import { delay, store, uid } from "./store";

export const REPORT_REASONS = [
  "Inappropriate behavior",
  "Fake profile",
  "Safety concern",
  "Other",
];

export const reportService = {
  async submitReport(input: {
    reportedUserId: string;
    reportedUser: string;
    reason: string;
    description?: string;
  }): Promise<Report> {
    const report: Report = {
      id: uid("RPT").toUpperCase(),
      reportedUserId: input.reportedUserId,
      reportedUser: input.reportedUser,
      reporter: store.profile.name,
      reason: input.reason,
      description: input.description ?? "",
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
      notes: [],
    };
    store.reports = [report, ...store.reports];
    return delay(report, 600);
  },
};
