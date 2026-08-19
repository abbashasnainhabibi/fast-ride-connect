import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/activity")({
  head: () => ({
    meta: [
      { title: "Activity log — FAST Carpool Admin" },
      { name: "description", content: "Chronological record of moderation actions taken on FAST Carpool." },
      { property: "og:title", content: "Activity log — FAST Carpool Admin" },
      { property: "og:description", content: "Audit trail of suspensions, bans and report decisions." },
    ],
  }),
  component: AdminActivity,
});

function AdminActivity() {
  const { data, error, loading, reload } = useAsync(() => adminService.getActivity());
  const events = data ?? [];

  return (
    <AdminLayout title="Activity log" description="Every moderation action, newest first.">
      {loading ? <LoadingState label="Loading activity…" /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && events.length === 0 ? (
        <EmptyState title="No activity yet" description="Moderation actions will be recorded here." />
      ) : null}

      {events.length > 0 ? (
        <ol className="surface divide-y p-2">
          {events.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{a.action}</p>
                <p className="text-sm text-muted-foreground">
                  {a.target} · by {a.admin}
                </p>
              </div>
              <time className="text-xs tabular-nums text-muted-foreground">{a.date}</time>
            </li>
          ))}
        </ol>
      ) : null}
    </AdminLayout>
  );
}
