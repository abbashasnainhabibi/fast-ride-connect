import { pageMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Phone, Users } from "lucide-react";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { ReportBlockMenu } from "@/components/ReportBlockMenu";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { RIDE_TYPE_LABEL } from "@/mock/types";
import { connectionService } from "@/services/connectionService";

export const Route = createFileRoute("/connections")({
  head: () => pageMeta("Your carpool connections — FAST Carpool", "Contact details for students you've connected with, unlocked after an accepted request.", "Coordinate rides with the students you're connected to."),
  component: ConnectionsPage,
});

function ConnectionsPage() {
  const { data, error, loading, reload } = useAsync(() => connectionService.getConnections());
  const connections = data ?? [];

  async function remove(id: string, name: string) {
    await connectionService.removeConnection(id);
    toast.success(`Connection with ${name} removed`);
    reload();
  }

  return (
    <StudentLayout
      title="Connections"
      description="Contact details unlock only after both students agree to carpool."
    >
      {loading ? <LoadingState label="Loading connections…" /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && connections.length === 0 ? (
        <EmptyState
          title="No connections yet"
          description="Accept a carpool request to unlock contact details and start coordinating."
          icon={<Users className="size-6" aria-hidden="true" />}
        />
      ) : null}

      <ul className="grid gap-4 md:grid-cols-2">
        {connections.map((c) => (
          <li key={c.id} className="surface flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {RIDE_TYPE_LABEL[c.rideType]} · connected {c.connectedAt}
                </p>
              </div>
              <ReportBlockMenu userId={c.userId} name={c.name} onBlocked={reload} />
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {c.pickupArea}
              </li>
              <li className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {c.days.join(", ")} · {c.timeWindow}
              </li>
              <li className="flex items-start gap-2 font-medium text-foreground">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:underline">
                  {c.phone}
                </a>
              </li>
            </ul>

            <div className="mt-auto flex gap-2 pt-1">
              <Button asChild variant="outline" className="flex-1">
                <a href={`tel:${c.phone.replace(/\s/g, "")}`}>Call</a>
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => remove(c.id, c.name)}>
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </StudentLayout>
  );
}
