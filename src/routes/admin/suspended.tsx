import { createFileRoute } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/layouts/AdminLayout";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { StatusPill } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/suspended")({
  head: () => ({
    meta: [
      { title: "Suspended accounts — FAST Carpool Admin" },
      { name: "description", content: "Review suspended and banned student accounts and reinstate them if cleared." },
      { property: "og:title", content: "Suspended accounts — FAST Carpool Admin" },
      { property: "og:description", content: "Accounts currently removed from matching on FAST Carpool." },
    ],
  }),
  component: AdminSuspended,
});

function AdminSuspended() {
  const { data, error, loading, reload } = useAsync(() => adminService.getSuspendedUsers());
  const users = data ?? [];

  async function reinstate(id: string, name: string) {
    await adminService.setUserStatus(id, "active");
    toast.success(`${name} reinstated`);
    reload();
  }

  return (
    <AdminLayout title="Suspended accounts" description="Students currently excluded from matching.">
      {loading ? <LoadingState label="Loading accounts…" /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && users.length === 0 ? (
        <EmptyState
          title="No suspended accounts"
          description="Every student account is currently active."
          icon={<ShieldOff className="size-6" aria-hidden="true" />}
        />
      ) : null}

      <ul className="grid gap-4 md:grid-cols-2">
        {users.map((u) => (
          <li key={u.id} className="surface flex items-start justify-between gap-3 p-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{u.name}</h3>
                <StatusPill status={u.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{u.email}</p>
              <p className="text-sm text-muted-foreground">
                {u.reportsReceived} report(s) · joined {u.joinedAt}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => reinstate(u.id, u.name)}>
              Reinstate
            </Button>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}
