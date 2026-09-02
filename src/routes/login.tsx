import { useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CREDENTIALS, authService } from "@/services/authService";

export const Route = createFileRoute("/login")({
  head: () => pageMeta("Login — FAST Carpool", "Log in to FAST Carpool to see your matches, requests and connections.", "Log in to see your carpool matches, requests and connections."),
  component: LoginPage,
});

type Role = "passenger" | "driver" | "admin";

const ROLES: { value: Role; label: string }[] = [
  { value: "passenger", label: "Passenger" },
  { value: "driver", label: "Driver" },
  { value: "admin", label: "Admin preview" },
];

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
      <div
        role="tablist"
        aria-label="Account type"
        className="mb-4 grid grid-cols-3 gap-1 rounded-lg border bg-muted p-1"
      >
        {ROLES.map((r) => (
          <button
            key={r.value}
            role="tab"
            aria-selected={role === r.value}
            onClick={() => setRole(r.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ease-out ${
              role === r.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {role === "admin" ? (
        <div className="surface space-y-4 p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div>
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
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              toast.info("FAST SSO is coming soon", {
                description: "For now, log in with your university email.",
              })
            }
          >
            <GraduationCap className="size-4" aria-hidden="true" />
            Continue with FAST SSO
          </Button>

          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            or continue with email
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="login-email">FAST university email</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in…" : `Log in as ${role === "driver" ? "driver" : "passenger"}`}
            </Button>
            <p className="rounded-md border border-dashed bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
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
