import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileWarning } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/layouts/AdminLayout";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { StatusPill } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAsync } from "@/hooks/useAsync";
import type { Report, ReportStatus } from "@/mock/types";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Reports queue — FAST Carpool Admin" },
      { name: "description", content: "Review student reports, add moderation notes and resolve or dismiss cases." },
      { property: "og:title", content: "Reports queue — FAST Carpool Admin" },
      { property: "og:description", content: "Triage safety and behavior reports from FAST Carpool students." },
    ],
  }),
  component: AdminReports,
});

const FILTERS: { value: "all" | ReportStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under review" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
];

function ConfirmAction({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ReportCard({ report, onChanged }: { report: Report; onChanged: () => void }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function setStatus(status: ReportStatus) {
    setBusy(true);
    try {
      await adminService.setReportStatus(report.id, status);
      toast.success(`${report.id} marked ${status.replace("_", " ")}`);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function addNote() {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await adminService.addNote(report.id, note.trim());
      setNote("");
      toast.success("Note added");
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="surface space-y-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{report.reportedUser}</h3>
            <StatusPill status={report.status} />
            <span className="text-xs text-muted-foreground">{report.id}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {report.reason} · reported by {report.reporter} on {report.date}
          </p>
        </div>
      </div>

      {report.description ? <p className="text-sm">{report.description}</p> : null}

      {report.notes.length > 0 ? (
        <ul className="space-y-1 rounded-lg bg-muted p-3">
          {report.notes.map((n, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              • {n}
            </li>
          ))}
        </ul>
      ) : null}

      <div>
        <label htmlFor={`note-${report.id}`} className="text-sm font-medium">
          Moderation note
        </label>
        <Textarea
          id={`note-${report.id}`}
          className="mt-1"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add an internal note…"
        />
        <div className="mt-2 flex justify-end">
          <Button size="sm" variant="outline" onClick={addNote} disabled={busy || !note.trim()}>
            Add note
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
        <Button size="sm" variant="outline" onClick={() => setStatus("under_review")} disabled={busy}>
          Mark under review
        </Button>
        <ConfirmAction
          trigger={
            <Button size="sm" variant="ghost" disabled={busy}>
              Dismiss
            </Button>
          }
          title={`Dismiss ${report.id}?`}
          description="The report will be closed with no action taken against the student. This is recorded in the activity log."
          confirmLabel="Dismiss report"
          onConfirm={() => setStatus("dismissed")}
        />
        <ConfirmAction
          trigger={
            <Button size="sm" disabled={busy}>
              Resolve
            </Button>
          }
          title={`Resolve ${report.id}?`}
          description="Mark this case as handled. Make sure any account action has already been applied."
          confirmLabel="Resolve report"
          onConfirm={() => setStatus("resolved")}
        />
      </div>
    </li>
  );
}

function AdminReports() {
  const { data, error, loading, reload } = useAsync(() => adminService.getReports());
  const reports = data ?? [];

  return (
    <AdminLayout title="Reports" description="Every report raised by students, oldest status first.">
      {loading ? <LoadingState label="Loading reports…" /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      {!loading && !error ? (
        <Tabs defaultValue="all">
          <TabsList className="flex-wrap">
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {FILTERS.map((f) => {
            const list = f.value === "all" ? reports : reports.filter((r) => r.status === f.value);
            return (
              <TabsContent key={f.value} value={f.value} className="mt-5">
                {list.length === 0 ? (
                  <EmptyState
                    title="Nothing here"
                    description="No reports match this filter."
                    icon={<FileWarning className="size-6" aria-hidden="true" />}
                  />
                ) : (
                  <ul className="space-y-4">
                    {list.map((r) => (
                      <ReportCard key={r.id} report={r} onChanged={reload} />
                    ))}
                  </ul>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      ) : null}
    </AdminLayout>
  );
}
