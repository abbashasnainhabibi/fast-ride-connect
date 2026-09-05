import { useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PasswordField } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/reset-password")({
  head: () => pageMeta("Reset password — FAST Carpool", "Choose a new password for your FAST Carpool student account.", "Set a new password for your FAST Carpool account."),
  component: ResetPasswordPage,
});

function strengthOf(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[0-9]/.test(pw) && /[a-zA-Z]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] ?? "Weak" };
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);

  const strength = strengthOf(password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { password?: string; confirm?: string } = {};
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    if (password !== confirm) next.confirm = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await authService.resetPassword(password);
      toast.success("Password updated. You can log in now.");
      navigate({ to: "/login" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a password you don't use anywhere else.">
      <div className="surface overflow-hidden">
        <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-3 sm:px-6">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <KeyRound className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">New password</p>
            <p className="truncate text-xs text-muted-foreground">Your reset link is valid for 30 minutes</p>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-5 p-4 sm:p-6">
          <div className="space-y-2">
            <PasswordField
              id="rp-password"
              label="New password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              {...(errors.password ? { error: errors.password } : { hint: "At least 8 characters." })}
            />
            <div aria-live="polite">
              <div className="flex gap-1" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                      password.length === 0
                        ? "bg-border"
                        : i < strength.score
                          ? strength.score <= 1
                            ? "bg-destructive"
                            : strength.score === 2
                              ? "bg-warning"
                              : "bg-success"
                          : "bg-border"
                    }`}
                  />
                ))}
              </div>
              {password.length > 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">Strength: {strength.label}</p>
              ) : null}
            </div>
          </div>

          <PasswordField
            id="rp-confirm"
            label="Confirm new password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            {...(errors.confirm ? { error: errors.confirm } : {})}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
