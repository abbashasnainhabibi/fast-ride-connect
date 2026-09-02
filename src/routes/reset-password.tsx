import { useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/reset-password")({
  head: () => pageMeta("Reset password — FAST Carpool", "Choose a new password for your FAST Carpool student account.", "Set a new password for your FAST Carpool account."),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);

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
      <form onSubmit={onSubmit} noValidate className="surface space-y-5 p-6">
        <div>
          <Label htmlFor="rp-password">New password</Label>
          <Input
            id="rp-password"
            type="password"
            autoComplete="new-password"
            className="mt-1"
            aria-invalid={!!errors.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-destructive">{errors.password}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
          )}
        </div>
        <div>
          <Label htmlFor="rp-confirm">Confirm new password</Label>
          <Input
            id="rp-confirm"
            type="password"
            autoComplete="new-password"
            className="mt-1"
            aria-invalid={!!errors.confirm}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {errors.confirm ? <p className="mt-1 text-xs text-destructive">{errors.confirm}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
