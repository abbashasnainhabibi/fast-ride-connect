import { useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <div className="surface p-6" role="status">
          <MailCheck className="size-8 text-success" aria-hidden="true" />
          <p className="mt-4 text-sm text-foreground">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
            The link expires in 30 minutes.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Prototype: no email is actually sent — continue to the reset screen.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={() => navigate({ to: "/reset-password" })}>Open reset screen</Button>
            <Button variant="outline" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="surface space-y-5 p-6">
          <div>
            <Label htmlFor="fp-email">FAST university email</Label>
            <Input
              id="fp-email"
              type="email"
              autoComplete="email"
              placeholder="k214512@nu.edu.pk"
              className="mt-1"
              aria-invalid={!!error}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={loading || email.trim().length === 0}>
            {loading ? "Sending link…" : "Send reset link"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
