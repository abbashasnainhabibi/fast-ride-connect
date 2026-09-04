import { useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { TextField } from "@/components/Field";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SsoBlock } from "@/components/SsoBlock";
import { Button } from "@/components/ui/button";
import { DEMO_CREDENTIALS, authService } from "@/services/authService";

export const Route = createFileRoute("/login")({
  head: () => pageMeta("Login — FAST Carpool", "Log in to FAST Carpool to see your matches, requests and connections.", "Log in to see your carpool matches, requests and connections."),
  component: LoginPage,
});

type Role = "passenger" | "driver" | "admin";

const ROLES = [
  { value: "passenger", label: "Passenger" },
  { value: "driver", label: "Driver" },
  { value: "admin", label: "Admin preview" },
] as const satisfies readonly { value: Role; label: string }[];

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("passenger");
  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.student.email);
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.student.password);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Log in to your account" subtitle="Use the FAST university email you signed up with.">
      <SegmentedControl
        label="Account type"
        value={role}
        options={ROLES}
        onChange={setRole}
        className="mb-4"
      />

      {role === "admin" ? (
        <div className="surface space-y-4 p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold">Moderation console</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Admin sign-in lives on a separate screen with its own credentials and audit log.
              </p>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link to="/admin-login">Continue to admin login</Link>
          </Button>
          <button
            type="button"
            onClick={() => setRole("passenger")}
            className="w-full text-center text-xs font-medium text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
          >
            ← Back to student login
          </button>
        </div>
      ) : (
        <div className="surface space-y-5 p-6">
          <SsoBlock context="log in" />

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <TextField
              id="login-email"
              label="FAST university email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="login-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              labelSuffix={
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
                >
                  Forgot password?
                </Link>
              }
            />
            {error ? (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in…" : `Log in as ${role === "driver" ? "driver" : "passenger"}`}
            </Button>
            <p className="break-words rounded-md border border-dashed bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              Demo login — {DEMO_CREDENTIALS.student.email} / {DEMO_CREDENTIALS.student.password}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/signup" className="font-medium text-foreground hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      )}
    </AuthLayout>
  );
}
