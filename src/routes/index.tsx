import { useState } from "react";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Eye, MapPin, PhoneOff, Search } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PICKUP_AREAS } from "@/mock/types";

export const Route = createFileRoute("/")({
  head: () => pageMeta("FAST Carpool — Find Your FAST Carpool", "Connect with FAST students who live near you and have a similar university schedule. Verified students, timetable-based matching, privacy-first pickup areas.", "Timetable-based carpool matching built for FAST students. Verified profiles and approximate pickup areas only."),
  component: Landing,
});

const STATS = [
  { value: "1,248", label: "Verified students" },
  { value: "324", label: "Active carpools" },
  { value: "92%", label: "Matches accepted" },
];

const STEPS = [
  {
    n: "01",
    title: "Verify your FAST email",
    text: "A one-time code confirms you're a current student.",
  },
  {
    n: "02",
    title: "Add your timetable",
    text: "We read only days and timings — never course or teacher names.",
  },
  {
    n: "03",
    title: "Request a seat",
    text: "Contact details unlock only when both sides accept.",
  },
];

const PRIVACY = [
  { icon: MapPin, title: "Approximate areas only", text: "Public landmarks, never home addresses." },
  { icon: PhoneOff, title: "Number stays hidden", text: "Shared only after a request is accepted." },
  { icon: Eye, title: "Courses stay private", text: "Only days and timings leave your timetable." },
];

const SAMPLE_MATCHES = [
  { name: "Ahmed R.", score: 94 },
  { name: "Mahnoor A.", score: 88 },
  { name: "Bilal A.", score: 81 },
];

function QuickMatch() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [window, setWindow] = useState("");

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <div className="surface grid gap-2 p-2 text-left shadow-lift sm:grid-cols-[1fr_1fr_1fr_auto]">
        <Select value={origin} onValueChange={setOrigin}>
          <SelectTrigger aria-label="Origin area" className="border-0 bg-muted/60 shadow-none">
            <SelectValue placeholder="Origin area" />
          </SelectTrigger>
          <SelectContent>
            {PICKUP_AREAS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger aria-label="Destination" className="border-0 bg-muted/60 shadow-none">
            <SelectValue placeholder="Destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fast">FAST NUCES — Main Campus</SelectItem>
            <SelectItem value="city">City Campus</SelectItem>
          </SelectContent>
        </Select>
        <Select value={window} onValueChange={setWindow}>
          <SelectTrigger aria-label="Time window" className="border-0 bg-muted/60 shadow-none">
            <SelectValue placeholder="Time window" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning · before 11:00</SelectItem>
            <SelectItem value="midday">Midday · 11:00–2:00</SelectItem>
            <SelectItem value="afternoon">Afternoon · after 2:00</SelectItem>
          </SelectContent>
        </Select>
        <Button size="lg" className="sm:h-full" onClick={() => navigate({ to: "/signup" })}>
          <Search className="size-4" aria-hidden="true" /> Find matches
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Sign up free to see live matches — takes about two minutes.
      </p>
    </div>
  );
}

function Landing() {
  return (
    <PublicLayout>
      <section className="grid-light border-b">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-20 text-center sm:pt-28">
          <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <BadgeCheck className="size-3.5 text-foreground" aria-hidden="true" />
            Built for FAST students
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl">
            Your campus commute, matched in minutes.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            FAST Carpool pairs verified students by real class timings and approximate pickup areas
            — never home addresses.
          </p>

          <QuickMatch />

          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-xl border bg-border">
            {STATS.map((s) => (
              <div key={s.label} className="bg-card px-4 py-5">
                <dt className="order-2 mt-1 block text-xs text-muted-foreground">{s.label}</dt>
                <dd className="nums font-display text-2xl font-bold tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20" aria-labelledby="features">
        <div className="max-w-xl">
          <h2 id="features" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Everything rides on trust
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Verification, matching and privacy — built in, not bolted on.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-6">
          <article className="surface p-6 md:col-span-4">
            <BadgeCheck className="size-5" aria-hidden="true" />
            <h3 className="mt-4 text-base font-semibold">Verified students only</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Every account is tied to a FAST university email, confirmed with a one-time code. No
              outsiders, no anonymous profiles.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {SAMPLE_MATCHES.map((m) => (
                <span
                  key={m.name}
                  className="inline-flex items-center gap-2 rounded-full border bg-muted/50 py-1 pl-1 pr-3 text-xs font-medium"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {m.name.charAt(0)}
                  </span>
                  {m.name}
                  <BadgeCheck className="size-3.5 text-muted-foreground" aria-hidden="true" />
                </span>
              ))}
            </div>
          </article>

          <article className="surface p-6 md:col-span-2">
            <h3 className="text-base font-semibold">Timetable sync</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload once — we keep your commute windows current.
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {["Mon 08:00", "Wed 08:00", "Fri 09:30"].map((t) => (
                <span
                  key={t}
                  className="nums rounded-full border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>

          <article className="surface p-6 md:col-span-2">
            <h3 className="text-base font-semibold">Automated matching</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ranked by timetable overlap, area and preferences.
            </p>
            <ul className="mt-6 space-y-2.5">
              {SAMPLE_MATCHES.map((m) => (
                <li key={m.name} className="flex items-center gap-2">
                  <span className="w-20 truncate text-xs text-muted-foreground">{m.name}</span>
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${m.score}%` }} />
                  </span>
                  <span className="nums w-8 text-right text-xs font-semibold">{m.score}%</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="surface p-6 md:col-span-4">
            <h3 className="text-base font-semibold">Privacy by default</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Carpooling only works when students feel safe. Here's exactly what stays private.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {PRIVACY.map((p) => (
                <div key={p.title}>
                  <p.icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  <h4 className="mt-2 text-sm font-semibold">{p.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="border-t bg-card" aria-labelledby="how">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 id="how" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n}>
                <p className="nums font-display text-sm font-semibold text-muted-foreground">{s.n}</p>
                <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Ready to share the ride?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Verify your FAST email, add your timetable, and see compatible students in minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/signup">Create your account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
