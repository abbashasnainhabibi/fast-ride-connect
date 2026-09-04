import { pageMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AsyncSection } from "@/components/AsyncSection";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/activity")({
  head: () => pageMeta("Activity log — FAST Carpool Admin", "Chronological record of moderation actions taken on FAST Carpool.", "Audit trail of suspensions, bans and report decisions."),
  component: AdminActivity,
});

function AdminActivity() {
  const { data, error, loading, reload } = useAsync(() => adminService.getActivity());

  return (
    <AdminLayout title="Activity log" description="Every moderation action, newest first.">
      <AsyncSection
        state={{ data, error, loading, reload }}
        loadingLabel="Loading activity…"
        empty={{ title: "No activity yet", description: "Moderation actions will be recorded here." }}
      >
        {(events) => (
        <ol className="surface divide-y p-2">
          {events.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{a.action}</p>
                <p className="text-sm text-muted-foreground">
                  {a.target} · by {a.admin}
                </p>
              </div>
              <time className="text-xs tabular-nums text-muted-foreground">{a.date}</time>
            </li>
          ))}
        </ol>
        )}
      </AsyncSection>
    </AdminLayout>
  );
}
