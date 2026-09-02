import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** "Continue with FAST SSO" button + divider, shared by login and signup. */
export function SsoBlock({ context }: { context: "log in" | "sign up" }) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast.info("FAST SSO is coming soon", {
            description: `For now, ${context} with your university email.`,
          })
        }
      >
        <GraduationCap className="size-4" aria-hidden="true" />
        Continue with FAST SSO
      </Button>

      <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        <span className="whitespace-nowrap">or continue with email</span>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
    </>
  );
}
