import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your FAST Carpool account" },
      {
        name: "description",
        content: "Sign up with your FAST university email to start finding compatible carpool partners.",
      },
      { property: "og:title", content: "Create your FAST Carpool account" },
      {
        property: "og:description",
        content: "Sign up with your FAST university email to find compatible carpool partners.",
      },
    ],
  }),
  component: SignupPage,
});

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

type Role = "passenger" | "driver";

function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("passenger");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (form.name.trim().length < 3) e.name = "Enter your full name.";
    if (!authService.isFastEmail(form.email)) e.email = "Use your FAST email (e.g. k214512@nu.edu.pk).";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      await authService.signup({ name: form.name, email: form.email, password: form.password });
      await authService.sendOtp();
      toast.info(`Joining as a ${role}`, {
        description: "You can change your ride type any time during onboarding.",
      });
      navigate({ to: "/verify" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="FAST Carpool is open only to students with a FAST university email."
    >
      <div
        role="tablist"
        aria-label="I will usually join as"
        className="mb-4 grid grid-cols-2 gap-1 rounded-lg border bg-muted p-1"
      >
        {(["passenger", "driver"] as const).map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={role === r}
            onClick={() => setRole(r)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-150 ease-out ${
              role === r
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="surface space-y-5 p-6">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            toast.info("FAST SSO is coming soon", {
              description: "For now, sign up with your university email.",
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

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              className="mt-1"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...field("name")}
            />
            {errors.name ? (
              <p id="name-error" className="mt-1 text-xs text-destructive">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="email">FAST university email</Label>
            <Input
              id="email"
              type="email"
              className="mt-1"
              placeholder="k214512@nu.edu.pk"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...field("email")}
            />
            {errors.email ? (
              <p id="email-error" className="mt-1 text-xs text-destructive">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="mt-1"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...field("password")}
            />
            {errors.password ? (
              <p id="password-error" className="mt-1 text-xs text-destructive">
                {errors.password}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              className="mt-1"
              autoComplete="new-password"
              aria-invalid={!!errors.confirm}
              aria-describedby={errors.confirm ? "confirm-error" : undefined}
              {...field("confirm")}
            />
            {errors.confirm ? (
              <p id="confirm-error" className="mt-1 text-xs text-destructive">
                {errors.confirm}
              </p>
            ) : null}
          </div>

          <div className="flex items-start gap-3 rounded-md border bg-muted/50 p-3">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              className="mt-0.5"
            />
            <Label htmlFor="consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
              I agree to the{" "}
              <Link to="/terms" className="font-medium text-foreground hover:underline">
                Terms of Use
              </Link>{" "}
              and the{" "}
              <Link to="/privacy" className="font-medium text-foreground hover:underline">
                Privacy Policy
              </Link>
              , including how my timetable timings and approximate pickup area are used.
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !consent}>
            {loading ? "Creating account…" : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
