import { useEffect, useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/verify")({
  head: () => pageMeta("Verify your FAST email — FAST Carpool", "Enter the 6-digit code sent to your FAST university email to verify your account.", "Confirm your FAST university email with a 6-digit verification code."),
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function verify() {
    setLoading(true);
    setError(null);
    try {
      await authService.verifyOtp(code);
      setVerified(true);
      setTimeout(() => navigate({ to: "/onboarding" }), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    await authService.sendOtp();
    setSeconds(45);
    setError(null);
    toast.success("New code sent to your university email");
  }

  if (verified) {
    return (
      <AuthLayout title="Email verified">
        <div className="surface flex flex-col items-center gap-3 px-6 py-12 text-center" role="status">
          <span className="grid size-12 place-items-center rounded-full bg-success/10">
            <CheckCircle2 className="size-6 text-success" aria-hidden="true" />
          </span>
          <p className="text-sm text-muted-foreground">Taking you to onboarding…</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your FAST email"
      subtitle="We sent a 6-digit verification code to your university email address."
    >
      <div className="surface overflow-hidden">
        <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-3 sm:px-6">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Mail className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Code sent to your inbox</p>
            <p className="truncate text-xs text-muted-foreground">Step 2 of 3 — email verification</p>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          <div>
            <Label htmlFor="otp">Verification code</Label>
            <div className="mt-2">
              <InputOTP id="otp" maxLength={6} value={code} onChange={setCode} containerClassName="w-full">
                <InputOTPGroup className="grid w-full grid-cols-6 gap-1.5 sm:gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="nums h-12 w-full rounded-md border border-input text-base font-medium first:rounded-l-md last:rounded-r-md"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Prototype codes: 123456 verifies, 000000 is expired.
            </p>
          </div>

          {error ? (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button className="w-full" onClick={verify} disabled={loading || code.length !== 6}>
            {loading ? "Verifying…" : "Verify email"}
          </Button>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t pt-4">
            <span className="min-w-0 truncate text-xs text-muted-foreground" aria-live="polite">
              {seconds > 0 ? `Resend available in ${seconds}s` : "Didn't get the code?"}
            </span>
            <Button variant="outline" size="sm" onClick={resend} disabled={seconds > 0} className="shrink-0">
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Resend
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Sign up again
        </Link>
      </p>
    </AuthLayout>
  );
}
