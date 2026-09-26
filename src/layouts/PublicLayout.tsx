import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5">
          <Brand />
          <nav className="flex items-center gap-1" aria-label="Main">
            <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground sm:inline-flex">
              <Link to="/privacy">Privacy</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Join FAST Carpool</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs">Made for FAST students. Not an official FAST NUCES service.</p>
          <div className="flex flex-wrap gap-5 text-xs">
            <Link to="/login" className="transition-colors duration-150 ease-out hover:text-foreground">
              Log in
            </Link>
            <Link to="/signup" className="transition-colors duration-150 ease-out hover:text-foreground">
              Create account
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
          </div>
        </div>
      </footer>
    </div>
  );
}
