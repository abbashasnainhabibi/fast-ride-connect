import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { MatchCard } from "@/components/MatchCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAsync } from "@/hooks/useAsync";
import { PICKUP_AREAS, type MatchProfile } from "@/mock/types";
import { matchService } from "@/services/matchService";
import { requestService } from "@/services/requestService";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your carpool matches — FAST Carpool" },
      { name: "description", content: "Browse FAST students whose class timings and pickup area line up with yours." },
      { property: "og:title", content: "Your carpool matches — FAST Carpool" },
      { property: "og:description", content: "Compatible carpool partners ranked by timetable overlap and pickup area." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data, error, loading, reload } = useAsync(() => matchService.getMatches());
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [ride, setRide] = useState("all");
  const [sent, setSent] = useState<string[]>([]);

  const matches = useMemo(() => {
    return (data ?? []).filter((m) => {
      if (query && !m.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (area !== "all" && m.pickupArea !== area) return false;
      if (ride !== "all" && m.rideType !== ride) return false;
      return true;
    });
  }, [data, query, area, ride]);

  async function request(match: MatchProfile) {
    try {
      await requestService.sendRequest(match);
      setSent((s) => [...s, match.id]);
      toast.success("Request sent ✓", { description: `${match.name} will see it in their requests.` });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send request");
    }
  }

  return (
    <StudentLayout
      title="Your matches"
      description={`${matches.length} compatible ${matches.length === 1 ? "student" : "students"} — ranked by timetable overlap, pickup area and your partner preference.`}
    >
      <div className="surface mb-6 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Search by name"
            aria-label="Search matches by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={area} onValueChange={setArea}>
          <SelectTrigger className="sm:w-56" aria-label="Filter by pickup area">
            <SelectValue placeholder="Pickup area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All pickup areas</SelectItem>
            {PICKUP_AREAS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ride} onValueChange={setRide}>
          <SelectTrigger className="sm:w-44" aria-label="Filter by ride type">
            <SelectValue placeholder="Ride type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any ride type</SelectItem>
            <SelectItem value="offer">Offering a ride</SelectItem>
            <SelectItem value="need">Needs a ride</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? <LoadingState label="Finding compatible students…" /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && matches.length === 0 ? (
        <EmptyState
          title="No matches yet"
          description="Try widening your filters, or update your schedule so we can find more overlap."
          icon={<Users className="size-6" aria-hidden="true" />}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            onRequest={sent.includes(m.id) ? () => toast.info("Request already sent") : request}
          />
        ))}
      </div>
    </StudentLayout>
  );
}
