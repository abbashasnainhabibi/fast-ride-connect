import { useMemo, useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Search } from "lucide-react";
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
  head: () => pageMeta("Manage students — FAST Carpool Admin", "Search FAST Carpool students and suspend, ban or reinstate accounts.", "Moderation controls for verified student accounts."),
  component: AdminUsers,
});

type SortKey = "name" | "reports";

function AdminUsers() {
  const { data, error, loading, reload } = useAsync(() => adminService.getUsers());
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const users = useMemo(() => {
    const filtered = (data ?? []).filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase()),
    );
    return [...filtered].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : b.reportsReceived - a.reportsReceived,
    );
  }, [data, query, sort]);

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
                <TableHead>
                  <button
                    type="button"
                    onClick={() => setSort("name")}
                    className="inline-flex items-center gap-1 transition-colors duration-150 ease-out hover:text-foreground"
                  >
                    Student
                    <ArrowUpDown className={`size-3 ${sort === "name" ? "text-foreground" : "text-muted-foreground/50"}`} aria-hidden="true" />
                  </button>
                </TableHead>
                <TableHead>Pickup area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    onClick={() => setSort("reports")}
                    className="inline-flex items-center gap-1 transition-colors duration-150 ease-out hover:text-foreground"
                  >
                    Reports
                    <ArrowUpDown className={`size-3 ${sort === "reports" ? "text-foreground" : "text-muted-foreground/50"}`} aria-hidden="true" />
                  </button>
                </TableHead>
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
