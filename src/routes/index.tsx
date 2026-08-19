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

function Landing() {
  return (
    <PublicLayout>
      <section className="hero-navy">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-navy-foreground">
              Built for FAST students
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-navy-foreground sm:text-5xl">
              Find Your FAST Carpool.
            </h1>
            <p className="mt-4 text-lg text-navy-foreground/80">
              Connect with FAST students who live near you and have a similar university schedule.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
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
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/signup">Create your account</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
