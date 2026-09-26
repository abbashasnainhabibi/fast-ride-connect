import { useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PasswordField, TextField } from "@/components/Field";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SsoBlock } from "@/components/SsoBlock";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/signup")({
  head: () => pageMeta("Create your FAST Carpool account", "Sign up with your FAST university email to start finding compatible carpool partners.", "Sign up with your FAST university email to find compatible carpool partners."),
  component: SignupPage,
});

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

type Role = "passenger" | "driver";

const ROLES = [
  { value: "passenger", label: "I need a ride" },
  { value: "driver", label: "I can offer a ride" },
] as const satisfies readonly { value: Role; label: string }[];

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
      title="Join FAST Carpool"
      subtitle="Use your university email. We’ll check it before you set up your commute."
    >
      <SegmentedControl label="I usually carpool as" value={role} options={ROLES} onChange={setRole} className="mb-5" />

      <div className="space-y-5 border-t pt-6">
        <SsoBlock context="sign up" />

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <TextField
              id="name"
              label="Full name"
              autoComplete="name"
              {...(errors.name ? { error: errors.name } : {})}
              {...field("name")}
          />

          <TextField
              id="email"
              label="FAST university email"
              type="email"
              placeholder="k214512@nu.edu.pk"
              autoComplete="email"
              {...(errors.email ? { error: errors.email } : {})}
              {...field("email")}
          />

          <PasswordField
              id="password"
              label="Password"
              autoComplete="new-password"
              {...(errors.password ? { error: errors.password } : { hint: "Use at least 8 characters." })}
              {...field("password")}
          />

          <PasswordField
              id="confirm"
              label="Confirm password"
              autoComplete="new-password"
              {...(errors.confirm ? { error: errors.confirm } : {})}
              {...field("confirm")}
          />

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
              Log in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
