import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { ScheduleEditor } from "@/components/ScheduleEditor";
import { ScheduleView } from "@/components/ScheduleView";
import { LoadingState } from "@/components/States";
import { Button } from "@/components/ui/button";
import type { ClassSlot } from "@/mock/types";
import { timetableService } from "@/services/timetableService";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "My class schedule — FAST Carpool" },
      { name: "description", content: "View and update the class timings used to find compatible carpool partners." },
      { property: "og:title", content: "My class schedule — FAST Carpool" },
      { property: "og:description", content: "Keep your weekly class timings accurate for better carpool matches." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const [slots, setSlots] = useState<ClassSlot[] | null>(null);
  const [draft, setDraft] = useState<ClassSlot[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void timetableService.getSchedule().then(setSlots);
  }, []);

  async function save() {
    if (!draft) return;
    setSaving(true);
    try {
      const saved = await timetableService.saveSchedule(draft);
      setSlots(saved);
      setDraft(null);
      toast.success("Schedule updated ✓");
    } finally {
      setSaving(false);
    }
  }

  return (
    <StudentLayout
      title="My schedule"
      description="Only days and times are shared — never course, section or teacher names."
      action={
        <Button asChild variant="outline">
          <Link to="/timetable/upload">Re-upload timetable</Link>
        </Button>
      }
    >
      <div className="surface p-6">
        {slots === null ? (
          <LoadingState label="Loading your schedule…" rows={2} />
        ) : draft ? (
          <>
            <ScheduleEditor slots={draft} onChange={setDraft} />
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <ScheduleView slots={slots} />
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setDraft(slots.map((s) => ({ ...s })))}>Edit timings</Button>
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
}
