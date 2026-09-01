import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS, type ClassSlot, type Day } from "@/mock/types";
import { newSlot } from "@/services/store";

const PRESET_WINDOWS = [
  { start: "08:00", end: "09:30" },
  { start: "09:30", end: "11:00" },
  { start: "11:00", end: "12:30" },
  { start: "12:30", end: "14:00" },
  { start: "14:00", end: "15:30" },
];

export function ScheduleEditor({
  slots,
  onChange,
}: {
  slots: ClassSlot[];
  onChange: (slots: ClassSlot[]) => void;
}) {
  const [newDay, setNewDay] = useState<Day>("Monday");

  const update = (id: string, patch: Partial<ClassSlot>) =>
    onChange(slots.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-5">
      {/* Quick toggle chips */}
      <div className="rounded-xl border p-4">
        <p className="text-xs font-medium text-muted-foreground">
          Quick toggle — tap a time to add or remove it from that day
        </p>
        <div className="mt-3 space-y-2">
          {DAYS.map((day) => (
            <div key={day} className="flex flex-wrap items-center gap-1.5">
              <span className="w-9 shrink-0 text-xs font-semibold">{day.slice(0, 3)}</span>
              {PRESET_WINDOWS.map((w) => {
                const existing = slots.find((s) => s.day === day && s.start === w.start);
                return (
                  <button
                    key={w.start}
                    type="button"
                    aria-pressed={!!existing}
                    aria-label={`${day} ${w.start}`}
                    onClick={() =>
                      existing
                        ? onChange(slots.filter((s) => s.id !== existing.id))
                        : onChange([...slots, newSlot({ day, start: w.start, end: w.end })])
                    }
                    className={`nums rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 ease-out ${
                      existing
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {w.start}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Fine-tune rows */}
      <ul className="space-y-3">
        {slots.map((slot) => (
          <li key={slot.id} className="rounded-xl border bg-card p-3 sm:flex sm:items-end sm:gap-3">
            <div className="min-w-40 flex-1">
              <Label htmlFor={`day-${slot.id}`} className="text-xs">
                Day
              </Label>
              <Select value={slot.day} onValueChange={(v) => update(slot.id, { day: v as Day })}>
                <SelectTrigger id={`day-${slot.id}`} className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 flex flex-1 gap-3 sm:mt-0">
              <div className="flex-1">
                <Label htmlFor={`start-${slot.id}`} className="text-xs">
                  Start time
                </Label>
                <Input
                  id={`start-${slot.id}`}
                  type="time"
                  className="mt-1"
                  value={slot.start}
                  onChange={(e) => update(slot.id, { start: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`end-${slot.id}`} className="text-xs">
                  End time
                </Label>
                <Input
                  id={`end-${slot.id}`}
                  type="time"
                  className="mt-1"
                  value={slot.end}
                  onChange={(e) => update(slot.id, { end: e.target.value })}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-3 text-destructive sm:mt-0"
              aria-label={`Delete ${slot.day} ${slot.start} class time`}
              onClick={() => onChange(slots.filter((s) => s.id !== slot.id))}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed p-3">
        <div className="min-w-40">
          <Label htmlFor="add-day" className="text-xs">
            Add class time on
          </Label>
          <Select value={newDay} onValueChange={(v) => setNewDay(v as Day)}>
            <SelectTrigger id="add-day" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" variant="outline" onClick={() => onChange([...slots, newSlot({ day: newDay })])}>
          <Plus className="size-4" aria-hidden="true" /> Add class time
        </Button>
      </div>
    </div>
  );
}
