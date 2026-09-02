import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ErrorState, LoadingState } from "@/components/States";
import { StatusPill } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/")({
  head: () => pageMeta("Moderation overview — FAST Carpool Admin", "Platform stats, pending reports and recent moderation activity.", "Key numbers and recent actions across FAST Carpool."),
  component: AdminHome,
});

function StatSkeletons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" role="status" aria-label="Loading stats">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="surface space-y-2 p-5" aria-hidden="true">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-7 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function AdminHome() {
  const stats = useAsync(() => adminService.getStats());
  const reports = useAsync(() => adminService.getReports());
  const activity = useAsync(() => adminService.getActivity());

  const pending = (reports.data ?? []).filter((r) => r.status === "pending").slice(0, 5);

  return (
    <AdminLayout title="Overview" description="Platform health and moderation queue at a glance.">
      {stats.loading ? <StatSkeletons /> : null}
      {stats.error ? <ErrorState message={stats.error} onRetry={stats.reload} /> : null}

      {stats.data ? (
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {stats.data.map((s) => (
            <div
              key={s.label}
              className="surface p-5 transition-shadow duration-150 ease-out hover:shadow-lift"
            >
              <dt className="text-xs font-medium text-muted-foreground">{s.label}</dt>
              <dd className="mt-2 flex items-baseline gap-2">
                <span className="nums font-display text-2xl font-bold tracking-tight">{s.value}</span>
                {"trend" in s && s.trend ? (
                  <span
                    className={`nums rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                      s.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {s.trend}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="surface p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Pending reports</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/reports">View all</Link>
            </Button>
          </div>
          {reports.loading ? (
            <LoadingState label="Loading reports…" rows={2} />
          ) : pending.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing waiting for review.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {pending.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border bg-card p-4 transition-colors duration-150 ease-out hover:bg-muted/40"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{r.reportedUser}</span>
                    <StatusPill status={r.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.reason} · reported by {r.reporter} ·{" "}
                    <span className="nums">{r.date}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Recent activity</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/activity">View all</Link>
            </Button>
          </div>
          {activity.loading ? (
            <LoadingState label="Loading activity…" rows={2} />
          ) : (
            <ul className="mt-4 space-y-2">
              {(activity.data ?? []).slice(0, 5).map((a) => (
                <li
                  key={a.id}
                  className="rounded-lg border bg-card p-4 transition-colors duration-150 ease-out hover:bg-muted/40"
                >
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.target} · {a.admin} · <span className="nums">{a.date}</span>
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
