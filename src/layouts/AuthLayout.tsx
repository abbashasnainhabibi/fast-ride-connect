import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, CalendarClock, MapPin } from "lucide-react";
import { Brand } from "@/components/Brand";

const POINTS = [
  { icon: BadgeCheck, title: "Verified students only", text: "Access is limited to valid FAST university emails." },
  { icon: CalendarClock, title: "Timetable-based matching", text: "We use class days and timings — nothing else." },
  { icon: MapPin, title: "Approximate areas", text: "Landmarks only. Home addresses are never collected." },
];

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="hero-navy route-grid hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-border lg:px-12 lg:py-10">
        <Brand tone="light" />
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-bold leading-tight text-navy-foreground">
            Carpool with students who share your schedule.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy-foreground/75">
            FAST Carpool matches you with verified classmates travelling the same way, at the same time.
          </p>
          <ul className="mt-8 space-y-5">
            {POINTS.map(({ icon: Icon, title: t, text }) => (
              <li key={t} className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10">
                  <Icon className="size-4 text-navy-foreground" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy-foreground">{t}</p>
                  <p className="text-sm text-navy-foreground/70">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-navy-foreground/60">
          Not an official FAST NUCES service. A student community project.
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex min-h-screen flex-col bg-background">
        <header className="border-b bg-card lg:hidden">
          <div className="mx-auto flex h-16 w-full max-w-md items-center px-4">
            <Brand />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
            <div className="mt-8">{children}</div>
          </div>
        </main>

        <footer className="border-t bg-card">
          <div className="mx-auto flex w-full max-w-md flex-wrap gap-x-5 gap-y-2 px-4 py-5 text-xs text-muted-foreground sm:px-8">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms of Use
            </Link>
            <Link to="/admin-login" className="hover:text-foreground">
              Admin
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
