import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function VerifiedBadge({ verified = true }: { verified?: boolean }) {
  if (!verified) {
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        Not verified
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1 border border-primary/20 bg-primary/10 text-primary">
      <BadgeCheck className="size-3.5" aria-hidden="true" />
      FAST Verified
    </Badge>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-success/10 text-success border-success/30",
    accepted: "bg-success/10 text-success border-success/30",
    resolved: "bg-success/10 text-success border-success/30",
    pending: "bg-warning/15 text-warning-foreground border-warning/40",
    under_review: "bg-primary/10 text-primary border-primary/30",
    suspended: "bg-warning/15 text-warning-foreground border-warning/40",
    banned: "bg-destructive/10 text-destructive border-destructive/30",
    declined: "bg-destructive/10 text-destructive border-destructive/30",
    cancelled: "bg-muted text-muted-foreground border-border",
    dismissed: "bg-muted text-muted-foreground border-border",
  };
  const label = status.replace("_", " ");
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {label}
    </span>
  );
}
