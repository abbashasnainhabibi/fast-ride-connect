import { useEffect, useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { ScheduleEditor } from "@/components/ScheduleEditor";
import { LoadingState } from "@/components/States";
import { Button } from "@/components/ui/button";
import type { ClassSlot } from "@/mock/types";
import { timetableService } from "@/services/timetableService";

export const Route = createFileRoute("/timetable/review")({
  head: () => pageMeta("Review your class timings — FAST Carpool", "Check and edit the class days and times we extracted from your timetable.", "Confirm your weekly class timings before we find carpool matches."),
  component: ReviewPage,
});

function ReviewPage() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<ClassSlot[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void timetableService.getSchedule().then(setSlots);
  }, []);

  async function confirm() {
    if (!slots) return;
    setSaving(true);
    try {
      await timetableService.saveSchedule(slots);
      toast.success("Schedule saved ✓");
      navigate({ to: "/dashboard" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <StudentLayout
      title="Review your class timings"
      description="Edit anything that looks off — matching uses only these days and times."
    >
      <div className="mx-auto max-w-2xl">
        <div className="surface p-4 sm:p-6">
          {slots === null ? (
            <LoadingState label="Loading your timetable…" />
          ) : (
            <>
              <ScheduleEditor slots={slots} onChange={setSlots} />
              <div className="mt-6 grid gap-2 sm:flex sm:justify-end">
                <Button variant="outline" onClick={() => navigate({ to: "/timetable/upload" })}>
                  Re-upload
                </Button>
                <Button onClick={confirm} disabled={saving || slots.length === 0}>
                  {saving ? "Saving…" : "Confirm schedule"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
