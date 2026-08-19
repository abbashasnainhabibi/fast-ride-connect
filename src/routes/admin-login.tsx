import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CREDENTIALS, authService } from "@/services/authService";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin login — FAST Carpool" },
      { name: "description", content: "Moderator sign-in for the FAST Carpool moderation console." },
      { property: "og:title", content: "Admin login — FAST Carpool" },
      { property: "og:description", content: "Restricted access for FAST Carpool moderators." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.admin.email);
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.admin.password);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.adminLogin(email, password);
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <ShieldCheck className="size-4" aria-hidden="true" /> Moderation console
        </p>
        <h1 className="mt-2 text-2xl font-bold">Admin login</h1>

        <form onSubmit={onSubmit} className="surface mt-6 space-y-5 p-6" noValidate>
          <div>
            <Label htmlFor="a-email">Admin email</Label>
            <Input
              id="a-email"
              type="email"
              autoComplete="email"
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="a-password">Password</Label>
            <Input
              id="a-password"
              type="password"
              autoComplete="current-password"
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Demo admin: {DEMO_CREDENTIALS.admin.email} / {DEMO_CREDENTIALS.admin.password}
            </p>
          </div>
          {error ? (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
}
