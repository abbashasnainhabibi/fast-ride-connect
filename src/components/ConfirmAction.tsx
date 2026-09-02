import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Single confirmation dialog used by every destructive / irreversible action
 * in the app (admin moderation, blocking, cancelling connections).
 */
export function ConfirmAction({
  trigger,
  label,
  title,
  description,
  confirmLabel,
  destructive = false,
  variant = "outline",
  disabled = false,
  onConfirm,
}: {
  trigger?: ReactNode;
  label?: string;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  variant?: "default" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button
            size="sm"
            variant={variant}
            disabled={disabled}
            className={cn(destructive && "text-destructive hover:text-destructive")}
          >
            {label}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
          >
            {confirmLabel ?? label ?? "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </AlertDialog>
  );
}
