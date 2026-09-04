import { useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { EmptyState } from "@/components/States";
import { AsyncSection } from "@/components/AsyncSection";
import { StatusPill, VerifiedBadge } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAsync } from "@/hooks/useAsync";
import { RIDE_TYPE_LABEL, type CarpoolRequest } from "@/mock/types";
import { requestService } from "@/services/requestService";
import { connectionService } from "@/services/connectionService";

export const Route = createFileRoute("/requests")({
  head: () => pageMeta("Carpool requests — FAST Carpool", "Track the carpool requests you have sent and respond to the ones you receive.", "Accept, decline or cancel carpool requests in one place."),
  component: RequestsPage,
});

function RequestRow({
  request,
  onAction,
}: {
  request: CarpoolRequest;
  onAction: (id: string, status: "accepted" | "declined" | "cancelled") => void;
}) {
  return (
    <li className="surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{request.name}</h3>
          <VerifiedBadge verified={request.verified} />
          <StatusPill status={request.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {request.pickupArea} · {RIDE_TYPE_LABEL[request.rideType]}
        </p>
        <p className="text-sm text-muted-foreground">
          {request.scheduleNote} · {request.date}
        </p>
      </div>

      {request.status === "pending" ? (
        <div className="flex shrink-0 gap-2">
          {request.direction === "received" ? (
            <>
              <Button size="sm" onClick={() => onAction(request.id, "accepted")}>
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={() => onAction(request.id, "declined")}>
                Decline
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => onAction(request.id, "cancelled")}>
              Cancel request
            </Button>
          )}
        </div>
      ) : null}
    </li>
  );
}

function RequestsPage() {
  const { data, error, loading, reload } = useAsync(() => requestService.getRequests());
  const [busy, setBusy] = useState(false);

  const requests = data ?? [];
  const received = requests.filter((r) => r.direction === "received");
  const sent = requests.filter((r) => r.direction === "sent");

  async function onAction(id: string, status: "accepted" | "declined" | "cancelled") {
    if (busy) return;
    setBusy(true);
    try {
      const updated = await requestService.updateStatus(id, status);
      if (status === "accepted") {
        await connectionService.createFromRequest(updated);
        toast.success("Connected ✓", { description: "Contact details are now unlocked." });
      } else {
        toast.success(status === "declined" ? "Request declined" : "Request cancelled");
      }
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update request");
    } finally {
      setBusy(false);
    }
  }

  return (
    <StudentLayout title="Requests" description="Carpool requests you've received and sent.">
      <AsyncSection state={{ data, error, loading, reload }} loadingLabel="Loading requests…" isEmpty={() => false}>
        {() => (
        <Tabs defaultValue="received">
          <TabsList>
            <TabsTrigger value="received">Received ({received.length})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-5">
            {received.length === 0 ? (
              <EmptyState
                title="No requests received"
                description="When another student requests a carpool with you, it will show up here."
                icon={<Inbox className="size-6" aria-hidden="true" />}
              />
            ) : (
              <ul className="space-y-3">
                {received.map((r) => (
                  <RequestRow key={r.id} request={r} onAction={onAction} />
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-5">
            {sent.length === 0 ? (
              <EmptyState
                title="No requests sent"
                description="Send a request from your matches to start a carpool."
                icon={<Inbox className="size-6" aria-hidden="true" />}
              />
            ) : (
              <ul className="space-y-3">
                {sent.map((r) => (
                  <RequestRow key={r.id} request={r} onAction={onAction} />
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
        )}
      </AsyncSection>
    </StudentLayout>
  );
}
