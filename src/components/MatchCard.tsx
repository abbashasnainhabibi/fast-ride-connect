import { Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { RIDE_TYPE_LABEL, formatTime, type MatchProfile } from "@/mock/types";

export function matchDeparture(match: MatchProfile): string | null {
  const shared = match.schedule.filter((s) => match.sharedDays.includes(s.day));
  const pool = shared.length ? shared : match.schedule;
  if (!pool.length) return null;
  return pool.reduce((a, b) => (a.start < b.start ? a : b)).start;
}

export function matchSeats(match: MatchProfile): number {
  if (match.rideType === "need") return 0;
  return 1 + (match.score % 3);
}

export function MatchCard({
  match,
  onRequest,
}: {
  match: MatchProfile;
  onRequest: (m: MatchProfile) => void;
}) {
  const departure = matchDeparture(match);
  const seats = matchSeats(match);

  return (
    <article className="surface flex flex-col p-5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground font-display text-sm font-semibold text-background">
          {match.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{match.name}</h3>
            <VerifiedBadge verified={match.verified} />
          </div>
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">
            {match.gender} · {RIDE_TYPE_LABEL[match.rideType].toLowerCase()}
          </p>
        </div>
        <span className="nums shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold">
          {match.score}%
        </span>
      </div>

      <ol className="ml-1 mt-5 space-y-5 border-l pl-5">
        <li className="relative">
          <span
            className="absolute -left-[26px] top-1.5 size-2 rounded-full bg-foreground"
            aria-hidden="true"
          />
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Departure
          </p>
          <p className="mt-0.5 text-sm">
            <span className="nums font-semibold">
              {departure ? formatTime(departure) : "Flexible"}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              {match.sharedDays.map((d) => d.slice(0, 3)).join(" · ")}
            </span>
          </p>
        </li>
        <li className="relative">
          <span
            className="absolute -left-[26px] top-1.5 size-2 rounded-full border-2 border-muted-foreground/40 bg-background"
            aria-hidden="true"
          />
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Pickup area
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold">{match.pickupArea}</p>
        </li>
      </ol>

      <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4">
        {seats > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" aria-hidden="true" />
            <span className="nums font-semibold text-foreground">{seats}</span> seats open
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">{match.scheduleNote}</span>
        )}
        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="sm">
            <Link to="/matches/$matchId" params={{ matchId: match.id }}>
              Details
            </Link>
          </Button>
          <Button size="sm" onClick={() => onRequest(match)}>
            {seats > 0 ? "Request seat" : "Request"}
          </Button>
        </div>
      </div>
    </article>
  );
}
