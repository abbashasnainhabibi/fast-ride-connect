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
    <article className="surface flex flex-col gap-4 p-5 transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">{match.score}% Carpool Match</p>
          <h3 className="mt-1 text-lg font-semibold">{match.name}</h3>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent font-display text-base font-semibold text-accent-foreground">
          {match.name.charAt(0)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <VerifiedBadge verified={match.verified} />
        <span className="rounded-full border bg-muted px-2.5 py-0.5 text-xs capitalize text-muted-foreground">
          {match.gender}
        </span>
      </div>

      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {match.pickupArea}
        </li>
        <li className="flex items-start gap-2">
          <CalendarClock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {RIDE_TYPE_LABEL[match.rideType]} · {match.scheduleNote}
        </li>
      </ul>

      <div className="mt-auto flex gap-2 pt-1">
        <Button asChild variant="outline" className="flex-1">
          <Link to="/matches/$matchId" params={{ matchId: match.id }}>
            View Match
          </Link>
        </Button>
        <Button className="flex-1" onClick={() => onRequest(match)}>
          Request Carpool
        </Button>
      </div>
    </article>
  );
}
