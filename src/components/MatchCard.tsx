import { Link } from "@tanstack/react-router";
import { CalendarClock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { RIDE_TYPE_LABEL, type MatchProfile } from "@/mock/types";

export function MatchCard({
  match,
  onRequest,
}: {
  match: MatchProfile;
  onRequest: (m: MatchProfile) => void;
}) {
  return (
    <article className="surface flex flex-col gap-3 p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-accent-foreground">
          {match.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-semibold">{match.name}</h3>
            <span className="shrink-0 rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
              {match.score}% match
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <VerifiedBadge verified={match.verified} />
            <span className="rounded-md border bg-muted px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
              {match.gender}
            </span>
          </div>
        </div>
      </div>

      <ul className="space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{match.pickupArea}</span>
        </li>
        <li className="flex items-start gap-2">
          <CalendarClock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>
            {RIDE_TYPE_LABEL[match.rideType]} · {match.scheduleNote}
          </span>
        </li>
      </ul>

      <div className="mt-auto flex gap-2 pt-1">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to="/matches/$matchId" params={{ matchId: match.id }}>
            View
          </Link>
        </Button>
        <Button size="sm" className="flex-1" onClick={() => onRequest(match)}>
          Request
        </Button>
      </div>
    </article>
  );
}
