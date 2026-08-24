import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center px-5">
        <Brand />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[400px]">
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
            Verified FAST students only. We never collect home addresses, and your phone number stays hidden
            until a carpool request is accepted.
          </p>
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-center gap-5 px-5 pb-8 text-xs text-muted-foreground">
        <Link to="/" className="transition-colors duration-150 ease-out hover:text-foreground">
          Home
        </Link>
        <Link to="/privacy" className="transition-colors duration-150 ease-out hover:text-foreground">
          Privacy
        </Link>
        <Link to="/terms" className="transition-colors duration-150 ease-out hover:text-foreground">
          Terms
        </Link>
        <Link to="/admin-login" className="transition-colors duration-150 ease-out hover:text-foreground">
          Admin
        </Link>
      </footer>
    </div>
  );
}
