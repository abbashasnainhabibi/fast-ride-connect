import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
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

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
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
    <PublicLayout>
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          FAST Carpool is only for students with a FAST university email.
        </p>

        <form onSubmit={onSubmit} noValidate className="surface mt-6 space-y-5 p-6">
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
            ) : null}
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </PublicLayout>
  );
}
