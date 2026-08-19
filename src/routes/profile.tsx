import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { StudentLayout } from "@/layouts/StudentLayout";
import { ErrorState, LoadingState } from "@/components/States";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAsync } from "@/hooks/useAsync";
import {
  PICKUP_AREAS,
  type Gender,
  type PartnerPreference,
  type RideType,
  type StudentUser,
} from "@/mock/types";
import { profileService } from "@/services/profileService";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — FAST Carpool" },
      { name: "description", content: "Update your ride type, pickup area, partner preference and contact number." },
      { property: "og:title", content: "Your profile — FAST Carpool" },
      { property: "og:description", content: "Manage the details used to match you with other FAST students." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data, error, loading, reload, setData } = useAsync(() => profileService.getProfile());
  const [saving, setSaving] = useState(false);

  const patch = (p: Partial<StudentUser>) => setData((prev) => (prev ? { ...prev, ...p } : prev));

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      await profileService.updateProfile({
        name: data.name,
        gender: data.gender,
        partnerPreference: data.partnerPreference,
        rideType: data.rideType,
        pickupArea: data.pickupArea,
        phone: data.phone,
      });
      toast.success("Profile updated ✓");
    } finally {
      setSaving(false);
    }
  }

  return (
    <StudentLayout title="Profile" description="These details drive your carpool matches.">
      {loading ? <LoadingState label="Loading profile…" rows={2} /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      {data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="surface h-fit p-6 text-center">
            <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-accent font-display text-2xl font-semibold text-accent-foreground">
              {data.name.charAt(0)}
            </span>
            <h2 className="mt-4 text-lg font-semibold">{data.name}</h2>
            <p className="text-sm text-muted-foreground">{data.email}</p>
            <div className="mt-3 flex justify-center">
              <VerifiedBadge verified={data.verified} />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-lg bg-muted p-3">
                <dt className="text-xs text-muted-foreground">Connections</dt>
                <dd className="text-lg font-semibold">{data.connectionCount}</dd>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <dt className="text-xs text-muted-foreground">Requests</dt>
                <dd className="text-lg font-semibold">{data.requestCount}</dd>
              </div>
            </dl>
          </div>

          <div className="surface space-y-5 p-6 lg:col-span-2">
            <div>
              <Label htmlFor="p-name">Full name</Label>
              <Input
                id="p-name"
                className="mt-1"
                value={data.name}
                onChange={(e) => patch({ name: e.target.value })}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-ride">Ride type</Label>
                <Select
                  value={data.rideType}
                  onValueChange={(v) => patch({ rideType: v as RideType })}
                >
                  <SelectTrigger id="p-ride" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offer">Offering a ride</SelectItem>
                    <SelectItem value="need">Needs a ride</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="p-gender">Gender</Label>
                <Select value={data.gender} onValueChange={(v) => patch({ gender: v as Gender })}>
                  <SelectTrigger id="p-gender" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="p-pref">Partner preference</Label>
                <Select
                  value={data.partnerPreference}
                  onValueChange={(v) => patch({ partnerPreference: v as PartnerPreference })}
                >
                  <SelectTrigger id="p-pref" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anyone">Anyone</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="p-area">Approximate pickup area</Label>
                <Select value={data.pickupArea} onValueChange={(v) => patch({ pickupArea: v })}>
                  <SelectTrigger id="p-area" className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PICKUP_AREAS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="p-phone">Phone number</Label>
              <Input
                id="p-phone"
                type="tel"
                className="mt-1"
                value={data.phone}
                onChange={(e) => patch({ phone: e.target.value })}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Hidden from other students until a request is accepted.
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </StudentLayout>
  );
}
