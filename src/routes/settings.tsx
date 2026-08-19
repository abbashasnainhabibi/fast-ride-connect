import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { EmptyState, LoadingState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAsync } from "@/hooks/useAsync";
import { profileService } from "@/services/profileService";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings and privacy — FAST Carpool" },
      { name: "description", content: "Manage privacy preferences, blocked students and your account session." },
      { property: "og:title", content: "Settings and privacy — FAST Carpool" },
      { property: "og:description", content: "Control what other students can see and manage blocked accounts." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { data, loading, reload } = useAsync(() => profileService.getBlockedUsers());
  const [showArea, setShowArea] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);

  async function unblock(name: string) {
    await profileService.unblockUser(name);
    toast.success(`${name} unblocked`);
    reload();
  }

  async function logout() {
    await authService.logout();
    navigate({ to: "/" });
  }

  const blocked = data ?? [];

  return (
    <StudentLayout title="Settings" description="Privacy controls and account options.">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface p-6">
          <h2 className="text-lg font-semibold">Privacy</h2>
          <p className="mt-1 flex items-start gap-2 rounded-lg bg-accent/60 p-3 text-sm text-accent-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            FAST Carpool never stores home addresses, course names or teacher names.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="s-area" className="font-normal">
                Show my approximate pickup area on match cards
              </Label>
              <Switch id="s-area" checked={showArea} onCheckedChange={setShowArea} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="s-disc" className="font-normal">
                Let other students discover me in matches
              </Label>
              <Switch id="s-disc" checked={discoverable} onCheckedChange={setDiscoverable} />
            </div>
          </div>
        </section>

        <section className="surface p-6">
          <h2 className="text-lg font-semibold">Blocked students</h2>
          <div className="mt-4">
            {loading ? (
              <LoadingState label="Loading blocked list…" rows={1} />
            ) : blocked.length === 0 ? (
              <EmptyState title="No blocked students" description="Blocked students never appear in your matches." />
            ) : (
              <ul className="space-y-2">
                {blocked.map((name) => (
                  <li
                    key={name}
                    className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
                  >
                    <span className="text-sm font-medium">{name}</span>
                    <Button size="sm" variant="ghost" onClick={() => unblock(name)}>
                      Unblock
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="surface p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You'll need to log in again with your FAST email.
          </p>
          <Button className="mt-4" variant="outline" onClick={logout}>
            Log out
          </Button>
        </section>
      </div>
    </StudentLayout>
  );
}
