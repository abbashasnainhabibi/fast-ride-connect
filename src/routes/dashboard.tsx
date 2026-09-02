import { useMemo, useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { MatchCard, matchDeparture } from "@/components/MatchCard";
import { EmptyState, ErrorState } from "@/components/States";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/useAsync";
import { PICKUP_AREAS, type MatchProfile } from "@/mock/types";
import { matchService } from "@/services/matchService";
import { requestService } from "@/services/requestService";

export const Route = createFileRoute("/dashboard")({
  head: () => pageMeta("Your carpool matches — FAST Carpool", "Browse FAST students whose class timings and pickup area line up with yours.", "Compatible carpool partners ranked by timetable overlap and pickup area."),
  component: DashboardPage,
});

const TIME_WINDOWS = [
  { value: "any", label: "Any time" },
  { value: "morning", label: "Morning" },
  { value: "midday", label: "Midday" },
  { value: "afternoon", label: "Afternoon" },
] as const;

function inWindow(departure: string | null, window: string): boolean {
  if (window === "any") return true;
  if (!departure) return false;
  const hour = Number(departure.split(":")[0] ?? 0);
  if (window === "morning") return hour < 11;
  if (window === "midday") return hour >= 11 && hour < 14;
  return hour >= 14;
}

function MatchSkeletons() {
  return (
    <div className="grid gap-4 xl:grid-cols-2" role="status" aria-label="Loading matches">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="surface space-y-4 p-5" aria-hidden="true">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}

function DashboardPage() {
  const { data, error, loading, reload } = useAsync(() => matchService.getMatches());
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [ride, setRide] = useState("all");
  const [window, setWindow] = useState<string>("any");
  const [sent, setSent] = useState<string[]>([]);

  const matches = useMemo(() => {
    return (data ?? []).filter((m) => {
      if (query && !m.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (area !== "all" && m.pickupArea !== area) return false;
      if (ride !== "all" && m.rideType !== ride) return false;
      if (!inWindow(matchDeparture(m), window)) return false;
      return true;
    });
  }, [data, query, area, ride, window]);

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
      title="Find a match"
      description={`${matches.length} compatible ${matches.length === 1 ? "student" : "students"} — ranked by timetable overlap, pickup area and your partner preference.`}
    >
      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-6">
        {/* Filter panel */}
        <aside className="surface mb-6 space-y-4 p-4 lg:sticky lg:top-8 lg:mb-0">
          <div>
            <Label htmlFor="match-search" className="text-xs">
              Search
            </Label>
            <div className="relative mt-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="match-search"
                className="pl-9"
                placeholder="Name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="filter-area" className="text-xs">
              Pickup area
            </Label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger id="filter-area" className="mt-1 w-full">
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
          </div>

          <div>
            <Label htmlFor="filter-ride" className="text-xs">
              Ride type
            </Label>
            <Select value={ride} onValueChange={setRide}>
              <SelectTrigger id="filter-ride" className="mt-1 w-full">
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

          <fieldset>
            <legend className="text-xs font-medium leading-6">Departure window</legend>
            <div className="flex flex-wrap gap-1.5">
              {TIME_WINDOWS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  aria-pressed={window === t.value}
                  onClick={() => setWindow(t.value)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 ease-out ${
                    window === t.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
        </aside>

        {/* Results */}
        <div>
          {loading ? <MatchSkeletons /> : null}
          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && matches.length === 0 ? (
            <EmptyState
              title="No matches yet"
              description="Try widening your filters, or update your schedule so we can find more overlap."
              icon={<Users className="size-6" aria-hidden="true" />}
            />
          ) : null}

          <div className="grid gap-4 xl:grid-cols-2">
            {matches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                onRequest={sent.includes(m.id) ? () => toast.info("Request already sent") : request}
              />
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
