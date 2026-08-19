import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { REPORT_REASONS, reportService } from "@/services/reportService";
import { profileService } from "@/services/profileService";

export function ReportBlockMenu({
  userId,
  name,
  onBlocked,
}: {
  userId: string;
  name: string;
  onBlocked?: () => void;
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reason, setReason] = useState(REPORT_REASONS[0]!);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitReport() {
    setSubmitting(true);
    try {
      await reportService.submitReport({ reportedUserId: userId, reportedUser: name, reason, description });
      toast.success("Report submitted ✓", { description: "Our moderation team will review it." });
      setReportOpen(false);
      setDescription("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not submit report");
    } finally {
      setSubmitting(false);
    }
  }

  async function blockUser() {
    await profileService.blockUser(name);
    toast.success(`${name} blocked`);
    onBlocked?.();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`More options for ${name}`}>
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setReportOpen(true)}>Report User</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onSelect={() => setBlockOpen(true)}>
            Block User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Why are you reporting this user?</DialogTitle>
            <DialogDescription>Reports about {name} are reviewed by moderators.</DialogDescription>
          </DialogHeader>
          <RadioGroup value={reason} onValueChange={setReason} className="gap-3">
            {REPORT_REASONS.map((r) => (
              <div key={r} className="flex items-center gap-3">
                <RadioGroupItem value={r} id={`reason-${r}`} />
                <Label htmlFor={`reason-${r}`} className="font-normal">
                  {r}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div>
            <Label htmlFor="report-desc">Description (optional)</Label>
            <Textarea
              id="report-desc"
              className="mt-1"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add anything that helps us understand what happened."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitReport} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={blockOpen} onOpenChange={setBlockOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They won't appear in your matches and can't send you carpool requests. You can unblock
              them from Settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={blockUser}>Block user</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
