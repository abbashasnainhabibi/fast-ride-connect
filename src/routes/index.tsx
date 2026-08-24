import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CalendarClock, Eye, MapPin, PhoneOff, Upload, UserCheck, Users } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FAST Carpool — Find Your FAST Carpool" },
      {
        name: "description",
        content:
          "Connect with FAST students who live near you and have a similar university schedule. Verified students, timetable-based matching, privacy-first pickup areas.",
      },
      { property: "og:title", content: "FAST Carpool — Find Your FAST Carpool" },
      {
        property: "og:description",
        content:
          "Timetable-based carpool matching built for FAST students. Verified profiles and approximate pickup areas only.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { icon: BadgeCheck, title: "Verify your FAST email", text: "Only students with a FAST university email can join." },
  { icon: Upload, title: "Upload your timetable", text: "We read only your class days and timings." },
  { icon: Users, title: "Find compatible students", text: "Matched on area, schedule, ride type and preferences." },
  { icon: UserCheck, title: "Connect after a request is accepted", text: "Contact details unlock only when both sides agree." },
];

const BENEFITS = [
  { icon: BadgeCheck, title: "FAST Verified", text: "Every profile is tied to a verified FAST university email." },
  { icon: CalendarClock, title: "Timetable-Based Matching", text: "Matches use your real class timings, not guesswork." },
  { icon: MapPin, title: "Privacy-Focused Locations", text: "Approximate areas and public landmarks — never home addresses." },
];

const PRIVACY = [
  { icon: MapPin, title: "Approximate pickup areas only", text: "You choose a nearby area or landmark. Exact addresses are never collected." },
  { icon: PhoneOff, title: "Phone number hidden", text: "Your number stays private until a carpool request is accepted." },
  { icon: Eye, title: "Course information stays private", text: "We use only days and timings from your timetable — never course, teacher or room." },
];

const TRUST = [
  { value: "FAST only", label: "Verified university emails" },
  { value: "Timings only", label: "No course or teacher data" },
  { value: "Landmarks", label: "Never home addresses" },
  { value: "Private", label: "Number hidden until accepted" },
];

function Landing() {
  return (
    <PublicLayout>
      <section className="hero-navy route-grid border-b">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-navy-foreground">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Built for FAST students
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-navy-foreground sm:text-6xl">
              Find your FAST carpool.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-foreground/75">
              Connect with verified FAST students who live near you and share your university schedule — matched on
              real class timings, not guesswork.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/signup">Get started free</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
              >
                <Link to="/login">Login</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-navy-foreground/55">
              Free for students · No car required · Takes about two minutes
            </p>
          </div>

          <dl className="mt-16 grid gap-px overflow-hidden rounded-xl border border-white/15 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.value} className="bg-transparent px-5 py-4 backdrop-blur-[1px]">
                <dt className="font-display text-base font-semibold text-navy-foreground">{t.value}</dt>
                <dd className="mt-1 text-xs text-navy-foreground/65">{t.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>


      <section className="mx-auto w-full max-w-6xl px-4 py-16" aria-labelledby="how">
        <h2 id="how" className="text-2xl font-bold sm:text-3xl">
          How It Works
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="surface p-5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <s.icon className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-semibold text-muted-foreground">Step {i + 1}</p>
              <h3 className="mt-1 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y bg-card" aria-labelledby="benefits">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 id="benefits" className="text-2xl font-bold sm:text-3xl">
            Why students use FAST Carpool
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {BENEFITS.map((b) => (
              <article key={b.title} className="rounded-xl border bg-background p-6">
                <b.icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16" aria-labelledby="privacy">
        <h2 id="privacy" className="text-2xl font-bold sm:text-3xl">
          Privacy by default
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Carpooling only works when students feel safe. Here's exactly what stays private.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PRIVACY.map((p) => (
            <article key={p.title} className="surface p-6">
              <p.icon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
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
              <Link to="/login">I already have one</Link>
            </Button>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
