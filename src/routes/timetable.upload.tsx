import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, FileUp, Loader2, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { Button } from "@/components/ui/button";
import { timetableService } from "@/services/timetableService";

export const Route = createFileRoute("/timetable/upload")({
  head: () => ({
    meta: [
      { title: "Upload your timetable — FAST Carpool" },
      {
        name: "description",
        content:
          "Upload your FAST timetable so we can match you with students on a similar schedule.",
      },
      { property: "og:title", content: "Upload your timetable — FAST Carpool" },
      {
        property: "og:description",
        content: "We only read class timings — course and teacher names stay private.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UploadPage,
});

const MAX_BYTES = 5 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function selectFile(picked: File) {
    setError(null);
    if (picked.size > MAX_BYTES) {
      setFile(null);
      setError("That file is larger than 5 MB. Try a smaller PDF or image.");
      return;
    }
    setFile({ name: picked.name, size: picked.size });
  }

  async function process() {
    if (!file) return;
    setError(null);
    setProcessing(true);
    try {
      const slots = await timetableService.processUpload(file);
      await timetableService.saveSchedule(slots);
      toast.success("Timings extracted");
      navigate({ to: "/timetable/review" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't read that file. Try another upload.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <StudentLayout
      title="Upload your timetable"
      description="We read class days and timings only — course names, sections and teachers are never stored."
    >
      <div className="mx-auto max-w-2xl">
        <div className="surface p-6">
          {processing ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-10 text-center">
              <Loader2 className="size-7 animate-spin text-primary" aria-hidden="true" />
              <p className="font-medium" aria-live="polite">
                Reading your timetable…
              </p>
              <p className="text-sm text-muted-foreground">{file?.name}</p>
            </div>
          ) : file ? (
            <div className="rounded-lg border border-border p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <FileText className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove file"
                  onClick={() => {
                    setFile(null);
                    setError(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={process}>Read timings</Button>
                <Button variant="outline" onClick={() => inputRef.current?.click()}>
                  Choose a different file
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
                dragging ? "border-primary bg-accent/40" : "border-border"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const picked = e.dataTransfer.files?.[0];
                if (picked) selectFile(picked);
              }}
            >
              <FileUp className="size-7 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="font-medium">Drag and drop your timetable</p>
                <p className="mt-1 text-sm text-muted-foreground">PDF, PNG or JPG up to 5 MB</p>
              </div>
              <Button variant="outline" onClick={() => inputRef.current?.click()}>
                Choose file
              </Button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/*"
            className="sr-only"
            aria-label="Timetable file"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) selectFile(picked);
            }}
          />

          {error ? (
            <div
              role="alert"
              className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              <span>{error}</span>
              {file ? (
                <Button variant="outline" size="sm" onClick={process}>
                  Try again
                </Button>
              ) : null}
            </div>
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
