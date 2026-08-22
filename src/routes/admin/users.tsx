import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/layouts/AdminLayout";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { StatusPill, VerifiedBadge } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAsync } from "@/hooks/useAsync";
import type { AccountStatus } from "@/mock/types";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Manage students — FAST Carpool Admin" },
      { name: "description", content: "Search FAST Carpool students and suspend, ban or reinstate accounts." },
      { property: "og:title", content: "Manage students — FAST Carpool Admin" },
      { property: "og:description", content: "Moderation controls for verified student accounts." },
    ],
  }),
  component: AdminUsers,
});

function AdminUsers() {
  const { data, error, loading, reload } = useAsync(() => adminService.getUsers());
  const [query, setQuery] = useState("");

  const users = useMemo(
    () =>
      (data ?? []).filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [data, query],
  );

  async function setStatus(id: string, status: AccountStatus, name: string) {
    await adminService.setUserStatus(id, status);
    toast.success(`${name} is now ${status}`);
    reload();
  }

  return (
    <AdminLayout title="Students" description="Search accounts and take moderation action.">
      <div className="surface mb-6 p-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Search by name or email"
            aria-label="Search students"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? <LoadingState label="Loading students…" /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && users.length === 0 ? (
        <EmptyState title="No students found" description="Try a different name or email." />
      ) : null}

      {users.length > 0 ? (
        <div className="surface overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Pickup area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Reports</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{u.name}</span>
                      <VerifiedBadge verified={u.verified} />
                    </div>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.pickupArea}</TableCell>
                  <TableCell>
                    <StatusPill status={u.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{u.reportsReceived}</TableCell>
                  <TableCell>
                     <div className="flex justify-end gap-2">
                      {u.status === "active" ? (
                        <Confirm
                          label="Suspend"
                          title={`Suspend ${u.name}?`}
                          description="They will lose access to matches and requests until reinstated."
                          onConfirm={() => setStatus(u.id, "suspended", u.name)}
                        />
                      ) : (
                        <Confirm
                          label="Reinstate"
                          title={`Reinstate ${u.name}?`}
                          description="Their account becomes active and visible in matching again."
                          onConfirm={() => setStatus(u.id, "active", u.name)}
                        />
                      )}
                      {u.status !== "banned" ? (
                        <Confirm
                          label="Ban"
                          variant="ghost"
                          destructive
                          title={`Ban ${u.name}?`}
                          description="This permanently removes their access to FAST Carpool."
                          onConfirm={() => setStatus(u.id, "banned", u.name)}
                        />
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </AdminLayout>
  );
}

function Confirm({
  label,
  title,
  description,
  onConfirm,
  variant = "outline",
  destructive = false,
}: {
  label: string;
  title: string;
  description: string;
  onConfirm: () => void;
  variant?: "outline" | "ghost";
  destructive?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant={variant} className={destructive ? "text-destructive" : undefined}>
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined}
            onClick={onConfirm}
          >
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
