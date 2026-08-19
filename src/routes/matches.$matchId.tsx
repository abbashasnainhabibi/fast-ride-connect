import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { ScheduleView } from "@/components/ScheduleView";
import { ReportBlockMenu } from "@/components/ReportBlockMenu";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { ErrorState, LoadingState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { RIDE_TYPE_LABEL } from "@/mock/types";
import { matchService } from "@/services/matchService";
import { requestService } from "@/services/requestService";

export const Route = createFileRoute("/matches/$matchId")({
  head: () => ({
    meta: [
      { title: "Match details — FAST Carpool" },
      { name: "description", content: "See shared class days, pickup area and compatibility before sending a carpool request." },
      { property: "og:title", content: "Match details — FAST Carpool" },
      { property: "og:description", content: "Review timetable overlap and pickup area for this carpool match." },
    ],
  }),
  component: MatchDetailPage,
});

function MatchDetailPage() {
  const { matchId } = Route.useParams();
  const { data: match, error, loading, reload } = useAsync(() => matchService.getMatch(matchId), [matchId]);
  const [sent, setSent] = useState(false);

  async function request() {
    if (!match) return;
    await requestService.sendRequest(match);
    setSent(true);
    toast.success("Request sent ✓");
  }

  return (
    <StudentLayout
      title="Match details"
      action={
        <Button asChild variant="ghost">
          <Link to="/dashboard">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to matches
          </Link>
        </Button>
      }
    >
      {loading ? <LoadingState label="Loading match…" rows={2} /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      {match ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="surface space-y-4 p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">{match.score}% Carpool Match</p>
                <h2 className="mt-1 text-2xl font-bold">{match.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {RIDE_TYPE_LABEL[match.rideType]} · {match.scheduleNote}
                </p>
              </div>
              <ReportBlockMenu userId={match.userId} name={match.name} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <VerifiedBadge verified={match.verified} />
              <span className="rounded-full border bg-muted px-2.5 py-0.5 text-xs capitalize text-muted-foreground">
                {match.gender}
              </span>
            </div>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
              {match.pickupArea} (approximate area)
            </p>

            <div>
              <h3 className="text-sm font-semibold">Shared class days</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {match.sharedDays.length ? match.sharedDays.join(", ") : "No overlapping days"}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Weekly class timings</h3>
              <ScheduleView slots={match.schedule} />
            </div>
          </div>

          <aside className="surface h-fit space-y-4 p-6">
            <h3 className="text-sm font-semibold">Contact details</h3>
            <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Phone number stays hidden until {match.name.split(" ")[0]} accepts your carpool request.
            </p>
            <Button className="w-full" onClick={request} disabled={sent}>
              {sent ? "Request sent" : "Request Carpool"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Course names, sections and teachers are never shared between students.
            </p>
          </aside>
        </div>
      ) : null}
    </StudentLayout>
  );
}
