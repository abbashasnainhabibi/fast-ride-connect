import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Brand />
          <nav className="flex items-center gap-2" aria-label="Main">
            <Button asChild variant="ghost">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Built for FAST students. Not an official FAST NUCES service.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="hover:text-foreground">
              Login
            </Link>
            <Link to="/signup" className="hover:text-foreground">
              Create account
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
        </div>
      </footer>
    </div>
  );
}
