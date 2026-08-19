import { DAYS, formatTime, type ClassSlot } from "@/mock/types";

export function ScheduleView({ slots }: { slots: ClassSlot[] }) {
  const days = DAYS.filter((d) => slots.some((s) => s.day === d));
  if (days.length === 0) {
    return <p className="text-sm text-muted-foreground">No class times added yet.</p>;
  }
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {days.map((day) => (
        <div key={day} className="rounded-xl border bg-muted/40 p-4">
          <dt className="text-sm font-semibold">{day}</dt>
          <dd className="mt-2 space-y-1">
            {slots
              .filter((s) => s.day === day)
              .sort((a, b) => a.start.localeCompare(b.start))
              .map((s) => (
                <p key={s.id} className="text-sm text-muted-foreground tabular-nums">
                  {formatTime(s.start)} — {formatTime(s.end)}
                </p>
              ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
