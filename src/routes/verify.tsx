import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify your FAST email — FAST Carpool" },
      { name: "description", content: "Enter the 6-digit code sent to your FAST university email to verify your account." },
      { property: "og:title", content: "Verify your FAST email — FAST Carpool" },
      { property: "og:description", content: "Confirm your FAST university email with a 6-digit verification code." },
    ],
  }),
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

  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-md px-4 py-16">
        {verified ? (
          <div className="surface flex flex-col items-center gap-3 p-10 text-center" role="status">
            <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
            <h1 className="text-xl font-bold">Email verified ✓</h1>
            <p className="text-sm text-muted-foreground">Taking you to onboarding…</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Verify your FAST email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a verification code to your university email.
            </p>

            <div className="surface mt-6 space-y-5 p-6">
              <div>
                <Label htmlFor="otp">6-digit code</Label>
                <div className="mt-2">
                  <InputOTP id="otp" maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Prototype codes: 123456 verifies, 000000 is expired.
                </p>
              </div>

              {error ? (
                <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button className="w-full" onClick={verify} disabled={loading || code.length !== 6}>
                {loading ? "Verifying…" : "Verify"}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground" aria-live="polite">
                  {seconds > 0 ? `Resend available in ${seconds}s` : "Didn't get the code?"}
                </span>
                <Button variant="ghost" size="sm" onClick={resend} disabled={seconds > 0}>
                  Resend code
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
}
