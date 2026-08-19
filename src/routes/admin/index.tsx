import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ErrorState, LoadingState } from "@/components/States";
import { StatusPill } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Moderation overview — FAST Carpool Admin" },
      { name: "description", content: "Platform stats, pending reports and recent moderation activity." },
      { property: "og:title", content: "Moderation overview — FAST Carpool Admin" },
      { property: "og:description", content: "Key numbers and recent actions across FAST Carpool." },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const stats = useAsync(() => adminService.getStats());
  const reports = useAsync(() => adminService.getReports());
  const activity = useAsync(() => adminService.getActivity());

  const pending = (reports.data ?? []).filter((r) => r.status === "pending").slice(0, 5);

  return (
    <AdminLayout title="Overview" description="Platform health and moderation queue at a glance.">
      {stats.loading ? <LoadingState label="Loading stats…" rows={1} /> : null}
      {stats.error ? <ErrorState message={stats.error} onRetry={stats.reload} /> : null}

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {(stats.data ?? []).map((s) => (
          <div key={s.label} className="surface p-5">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 font-display text-2xl font-bold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="surface p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Pending reports</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/reports">View all</Link>
            </Button>
          </div>
          {reports.loading ? (
            <LoadingState label="Loading reports…" rows={2} />
          ) : pending.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing waiting for review.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pending.map((r) => (
                <li key={r.id} className="rounded-lg border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{r.reportedUser}</span>
                    <StatusPill status={r.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.reason} · reported by {r.reporter} on {r.date}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/activity">View all</Link>
            </Button>
          </div>
          {activity.loading ? (
            <LoadingState label="Loading activity…" rows={2} />
          ) : (
            <ul className="mt-4 space-y-3">
              {(activity.data ?? []).slice(0, 5).map((a) => (
                <li key={a.id} className="rounded-lg border bg-card p-4">
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {a.target} · {a.admin} · {a.date}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
