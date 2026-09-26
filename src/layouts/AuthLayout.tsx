import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, PhoneOff } from "lucide-react";
import { Brand } from "@/components/Brand";

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
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(300px,0.85fr)_minmax(500px,1.15fr)]">
      <aside className="hidden border-r bg-secondary lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:p-10 xl:p-14">
        <Brand />
        <div className="max-w-md">
          <p className="text-sm font-semibold text-primary">Your commute, with people from FAST.</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
            Find someone whose week already looks like yours.
          </h2>
          <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-3"><CheckCircle2 className="size-4 text-primary" /> FAST email verification</li>
            <li className="flex items-center gap-3"><MapPin className="size-4 text-primary" /> Approximate pickup areas only</li>
            <li className="flex items-center gap-3"><PhoneOff className="size-4 text-primary" /> Phone numbers stay private until accepted</li>
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">Not an official FAST NUCES service.</p>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center px-5 lg:hidden">
          <Brand />
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:py-12">
          <div className="w-full max-w-[430px]">
            <div>
              <p className="mb-2 text-sm font-semibold text-primary">FAST Carpool</p>
              <h1 className="font-display text-3xl font-semibold leading-tight">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p> : null}
            </div>
            <div className="mt-7">{children}</div>
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-5 px-5 py-6 text-xs text-muted-foreground">
        <Link to="/" className="transition-colors duration-150 ease-out hover:text-foreground">
          Home
        </Link>
        <Link to="/privacy" className="transition-colors duration-150 ease-out hover:text-foreground">
          Privacy
        </Link>
        <Link to="/terms" className="transition-colors duration-150 ease-out hover:text-foreground">
          Terms
        </Link>
        </footer>
      </div>
    </div>
  );
}
