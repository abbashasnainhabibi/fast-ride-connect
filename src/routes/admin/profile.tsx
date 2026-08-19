import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ErrorState, LoadingState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/adminService";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "Admin profile — FAST Carpool Admin" },
      { name: "description", content: "Moderator account details and session controls for FAST Carpool." },
      { property: "og:title", content: "Admin profile — FAST Carpool Admin" },
      { property: "og:description", content: "Your moderator account details and last sign-in." },
    ],
  }),
  component: AdminProfile,
});

function AdminProfile() {
  const navigate = useNavigate();
  const { data, error, loading, reload } = useAsync(() => adminService.getProfile());

  async function logout() {
    await authService.logout();
    navigate({ to: "/admin-login" });
  }

  return (
    <AdminLayout title="Admin profile" description="Your moderator account.">
      {loading ? <LoadingState label="Loading profile…" rows={1} /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      {data ? (
        <div className="surface max-w-xl p-6">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent font-display text-xl font-semibold text-accent-foreground">
            {data.name.charAt(0)}
          </span>
          <h2 className="mt-4 text-lg font-semibold">{data.name}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b pb-2">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{data.email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b pb-2">
              <dt className="text-muted-foreground">Role</dt>
              <dd>{data.role}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Last login</dt>
              <dd className="tabular-nums">{data.lastLogin}</dd>
            </div>
          </dl>
          <Button className="mt-6" variant="outline" onClick={logout}>
            Log out
          </Button>
        </div>
      ) : null}
    </AdminLayout>
  );
}
