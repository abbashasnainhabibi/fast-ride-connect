import { useMemo, useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AsyncSection } from "@/components/AsyncSection";
import { ConfirmAction } from "@/components/ConfirmAction";
import { SearchInput } from "@/components/SearchInput";
import { StatusPill, VerifiedBadge } from "@/components/VerifiedBadge";
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
  head: () =>
    pageMeta(
      "Manage students — FAST Carpool Admin",
      "Search FAST Carpool students and suspend, ban or reinstate accounts.",
      "Moderation controls for verified student accounts.",
    ),
  component: AdminUsers,
});

type SortKey = "name" | "reports";

function SortHeader({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 whitespace-nowrap transition-colors duration-150 ease-out hover:text-foreground"
    >
      {children}
      <ArrowUpDown
        className={`size-3 ${active ? "text-foreground" : "text-muted-foreground/50"}`}
        aria-hidden="true"
      />
    </button>
  );
}

function AdminUsers() {
  const state = useAsync(() => adminService.getUsers());
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const users = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = (state.data ?? []).filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
    return [...filtered].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : b.reportsReceived - a.reportsReceived,
    );
  }, [state.data, query, sort]);

  async function setStatus(id: string, status: AccountStatus, name: string) {
    await adminService.setUserStatus(id, status);
    toast.success(`${name} is now ${status}`);
    state.reload();
  }

  return (
    <AdminLayout title="Students" description="Search accounts and take moderation action.">
      <div className="surface mb-6 p-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          label="Search students"
          placeholder="Search by name or email"
        />
      </div>

      <AsyncSection
        state={state}
        loadingLabel="Loading students…"
        isEmpty={() => users.length === 0}
        empty={{ title: "No students found", description: "Try a different name or email." }}
      >
        {() => (
          <div className="surface w-full overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortHeader active={sort === "name"} onClick={() => setSort("name")}>
                      Student
                    </SortHeader>
                  </TableHead>
                  <TableHead>Pickup area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    <SortHeader active={sort === "reports"} onClick={() => setSort("reports")}>
                      Reports
                    </SortHeader>
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
                      <p className="break-all text-xs text-muted-foreground">{u.email}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.pickupArea}</TableCell>
                    <TableCell>
                      <StatusPill status={u.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{u.reportsReceived}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {u.status === "active" ? (
                          <ConfirmAction
                            label="Suspend"
                            title={`Suspend ${u.name}?`}
                            description="They will lose access to matches and requests until reinstated."
                            onConfirm={() => setStatus(u.id, "suspended", u.name)}
                          />
                        ) : (
                          <ConfirmAction
                            label="Reinstate"
                            title={`Reinstate ${u.name}?`}
                            description="Their account becomes active and visible in matching again."
                            onConfirm={() => setStatus(u.id, "active", u.name)}
                          />
                        )}
                        {u.status !== "banned" ? (
                          <ConfirmAction
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
        )}
      </AsyncSection>
    </AdminLayout>
  );
}
