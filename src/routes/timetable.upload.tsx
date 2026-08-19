import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { Button } from "@/components/ui/button";
import { timetableService } from "@/services/timetableService";

export const Route = createFileRoute("/timetable/upload")({
  head: () => ({
    meta: [
      { title: "Upload your timetable — FAST Carpool" },
      { name: "description", content: "Upload your FAST timetable so we can match you with students on a similar schedule." },
      { property: "og:title", content: "Upload your timetable — FAST Carpool" },
      { property: "og:description", content: "We only read class timings — course and teacher names stay private." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    setError(null);
    setProcessing(true);
    try {
      const slots = await timetableService.processUpload({ name: file.name, size: file.size });
      await timetableService.saveSchedule(slots);
      toast.success("Timetable processed");
      navigate({ to: "/timetable/review" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not process that file");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <StudentLayout
      title="Upload your timetable"
      description="We only extract class days and timings — never course or teacher names."
    >
      <div className="mx-auto max-w-2xl">
        <div className="surface p-6">
          <div
            className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border p-10 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) void handleFile(file);
            }}
          >
            {processing ? (
              <>
                <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
                <p className="font-medium" aria-live="polite">
                  Processing your timetable…
                </p>
                <p className="text-sm text-muted-foreground">{fileName}</p>
              </>
            ) : (
              <>
                <FileUp className="size-8 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium">Drag and drop your timetable</p>
                  <p className="mt-1 text-sm text-muted-foreground">PDF, PNG or JPG up to 5 MB</p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,image/*"
                  className="sr-only"
                  aria-label="Timetable file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFile(file);
                  }}
                />
                <Button onClick={() => inputRef.current?.click()}>Choose file</Button>
                {fileName ? <p className="text-sm text-muted-foreground">{fileName}</p> : null}
              </>
            )}
          </div>

          {error ? (
            <p role="alert" className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <p className="mt-5 flex items-start gap-2 rounded-lg bg-accent/60 p-3 text-sm text-accent-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Only your class timings are used for matching. Course names, sections and teachers are
            never shown to other students.
          </p>

          <div className="mt-5 flex justify-end">
            <Button variant="ghost" onClick={() => navigate({ to: "/timetable/review" })}>
              Enter timings manually
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
