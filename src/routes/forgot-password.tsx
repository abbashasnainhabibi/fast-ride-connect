import { useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LifeBuoy, MailCheck } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { TextField } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/forgot-password")({
  head: () => pageMeta("Forgot password — FAST Carpool", "Request a password reset link for your FAST Carpool account using your university email.", "Reset your FAST Carpool password with your university email."),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authService.isFastEmail(email)) {
      setError("Use your FAST university email (e.g. k214512@nu.edu.pk).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title={sent ? "Check your university inbox" : "Forgot your password?"}
      subtitle={
        sent
          ? undefined
          : "Enter your FAST university email and we'll send you a link to set a new password."
      }
    >
      {sent ? (
        <div className="surface p-4 sm:p-6" role="status">
          <span className="grid size-11 place-items-center rounded-full bg-success/10">
            <MailCheck className="size-5 text-success" aria-hidden="true" />
          </span>
          <p className="mt-4 break-words text-sm text-foreground">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
            The link expires in 30 minutes.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Prototype: no email is actually sent — continue to the reset screen.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Button onClick={() => navigate({ to: "/reset-password" })}>Open reset screen</Button>
            <Button variant="outline" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </div>
        </div>
      ) : (
        <div className="surface overflow-hidden">
          <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-3 sm:px-6">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <LifeBuoy className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Account recovery</p>
              <p className="truncate text-xs text-muted-foreground">Verified FAST emails only</p>
            </div>
          </div>
          <form onSubmit={onSubmit} noValidate className="space-y-5 p-4 sm:p-6">
            <TextField
              id="fp-email"
              label="FAST university email"
              type="email"
              autoComplete="email"
              placeholder="k214512@nu.edu.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              {...(error ? { error } : {})}
            />
            <Button type="submit" className="w-full" disabled={loading || email.trim().length === 0}>
              {loading ? "Sending link…" : "Send reset link"}
            </Button>
          </form>
        </div>
      )}

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
