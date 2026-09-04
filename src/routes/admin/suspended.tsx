import { pageMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AsyncSection } from "@/components/AsyncSection";
import { StatusPill } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/suspended")({
  head: () => pageMeta("Suspended accounts — FAST Carpool Admin", "Review suspended and banned student accounts and reinstate them if cleared.", "Accounts currently removed from matching on FAST Carpool."),
  component: AdminSuspended,
});

function AdminSuspended() {
  const { data, error, loading, reload } = useAsync(() => adminService.getSuspendedUsers());

  async function reinstate(id: string, name: string) {
    await adminService.setUserStatus(id, "active");
    toast.success(`${name} reinstated`);
    reload();
  }

  return (
    <AdminLayout title="Suspended accounts" description="Students currently excluded from matching.">
      <AsyncSection
        state={{ data, error, loading, reload }}
        loadingLabel="Loading accounts…"
        empty={{
          title: "No suspended accounts",
          description: "Every student account is currently active.",
          icon: <ShieldOff className="size-6" aria-hidden="true" />,
        }}
      >
        {(users) => (
        <ul className="grid gap-4 md:grid-cols-2">
          {users.map((u) => (
            <li key={u.id} className="surface flex flex-wrap items-start justify-between gap-3 p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{u.name}</h3>
                  <StatusPill status={u.status} />
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{u.email}</p>
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
        )}
      </AsyncSection>
    </AdminLayout>
  );
}
