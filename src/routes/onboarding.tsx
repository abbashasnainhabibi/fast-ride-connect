import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Info, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PICKUP_AREAS, type Gender, type PartnerPreference, type RideType } from "@/mock/types";
import { profileService } from "@/services/profileService";
import { authService } from "@/services/authService";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your carpool profile — FAST Carpool" },
      { name: "description", content: "Tell us your ride type, preferences, approximate pickup area and phone number." },
      { property: "og:title", content: "Set up your carpool profile — FAST Carpool" },
      { property: "og:description", content: "A few quick steps to start matching with FAST students near you." },
    ],
  }),
  component: OnboardingPage,
});

const STEPS = ["Ride", "Preferences", "Pickup", "Phone", "Timetable"];

function Option({
  id,
  value,
  label,
  hint,
}: {
  id: string;
  value: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40">
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <Label htmlFor={id} className="flex flex-col items-start gap-1 font-normal">
        <span className="font-medium">{label}</span>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </Label>
    </div>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [rideType, setRideType] = useState<RideType>("need");
  const [gender, setGender] = useState<Gender>("male");
  const [preference, setPreference] = useState<PartnerPreference>("anyone");
  const [pickupArea, setPickupArea] = useState(PICKUP_AREAS[0]!);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  async function finish() {
    if (phone.trim().length < 10) {
      setPhoneError("Enter a valid phone number.");
      return;
    }
    setSaving(true);
    try {
      await profileService.updateProfile({ rideType, gender, partnerPreference: preference, pickupArea, phone });
      authService.setOnboarded();
      toast.success("Profile saved");
      navigate({ to: "/timetable/upload" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-xl px-4 py-14">
        <p className="text-sm font-medium text-muted-foreground">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-3" />

        <div className="surface mt-6 space-y-5 p-6">
          {step === 0 ? (
            <fieldset>
              <legend className="text-lg font-semibold">How do you want to carpool?</legend>
              <RadioGroup
                className="mt-4 gap-3"
                value={rideType}
                onValueChange={(v) => setRideType(v as RideType)}
              >
                <Option id="rt-offer" value="offer" label="I can offer a ride" />
                <Option id="rt-need" value="need" label="I need a ride" />
                <Option id="rt-both" value="both" label="Both" />
              </RadioGroup>
            </fieldset>
          ) : null}

          {step === 1 ? (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-lg font-semibold">Your gender</legend>
                <RadioGroup className="mt-4 gap-3" value={gender} onValueChange={(v) => setGender(v as Gender)}>
                  <Option id="g-male" value="male" label="Male" />
                  <Option id="g-female" value="female" label="Female" />
                </RadioGroup>
              </fieldset>
              <fieldset>
                <legend className="text-lg font-semibold">Preferred carpool partner</legend>
                <RadioGroup
                  className="mt-4 gap-3"
                  value={preference}
                  onValueChange={(v) => setPreference(v as PartnerPreference)}
                >
                  <Option id="p-any" value="anyone" label="Anyone" />
                  <Option id="p-male" value="male" label="Male only" />
                  <Option id="p-female" value="female" label="Female only" />
                </RadioGroup>
              </fieldset>
            </div>
          ) : null}

          {step === 2 ? (
            <fieldset>
              <legend className="text-lg font-semibold">Approximate pickup area</legend>
              <p className="mt-2 flex items-start gap-2 rounded-lg bg-accent/60 p-3 text-sm text-accent-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Don't enter your home address. Choose a nearby area or public landmark instead.
              </p>
              <Label className="mt-4 block">Search for an area</Label>
              <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={areaOpen}
                    className="mt-1 w-full justify-between font-normal"
                  >
                    {pickupArea}
                    <ChevronsUpDown className="size-4 opacity-50" aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search areas or landmarks…" />
                    <CommandList>
                      <CommandEmpty>No area found.</CommandEmpty>
                      <CommandGroup>
                        {PICKUP_AREAS.map((area) => (
                          <CommandItem
                            key={area}
                            value={area}
                            onSelect={() => {
                              setPickupArea(area);
                              setAreaOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 size-4 ${pickupArea === area ? "opacity-100" : "opacity-0"}`}
                              aria-hidden="true"
                            />
                            {area}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </fieldset>
          ) : null}


          {step === 3 ? (
            <div>
              <h2 className="text-lg font-semibold">Phone number</h2>
              <p className="mt-2 flex items-start gap-2 rounded-lg bg-accent/60 p-3 text-sm text-accent-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Your phone number stays hidden until a carpool request is accepted.
              </p>
              <Label htmlFor="phone" className="mt-4 block">
                Phone number
              </Label>
              <div className="mt-1 flex gap-2">
                <Select value={dialCode} onValueChange={setDialCode}>
                  <SelectTrigger className="w-32" aria-label="Country code">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIAL_CODES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  className="flex-1"
                  type="tel"
                  inputMode="tel"
                  placeholder="300 1234567"
                  value={phone}
                  aria-invalid={!!phoneError}
                  aria-describedby={phoneError ? "phone-error" : undefined}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError(null);
                  }}
                />
              </div>

              {phoneError ? (
                <p id="phone-error" className="mt-1 text-xs text-destructive">
                  {phoneError}
                </p>
              ) : null}
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <h2 className="text-lg font-semibold">Add your timetable</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Last step. Upload your FAST timetable and we'll read only the class days and
                timings — course names, sections and teachers are never stored or shown.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  You can review and edit every timing before it is saved.
                </li>
                <li className="flex items-start gap-2">
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  Prefer typing? You can enter timings manually on the next screen.
                </li>
              </ul>
            </div>
          ) : null}

          <div className="flex justify-between gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => {
                  if (step === 3 && phone.trim().length < 10) {
                    setPhoneError("Enter a valid phone number.");
                    return;
                  }
                  setStep((s) => s + 1);
                }}
              >
                Continue
              </Button>
            ) : (
              <Button onClick={finish} disabled={saving}>
                {saving ? "Saving…" : "Save and continue"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
