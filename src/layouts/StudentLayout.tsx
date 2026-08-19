import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Home, Inbox, LogOut, Settings, User, Users } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

const NAV = [
  { to: "/dashboard", label: "Dashboard", mobileLabel: "Home", icon: Home },
  { to: "/schedule", label: "My Schedule", mobileLabel: "Schedule", icon: CalendarDays },
  { to: "/requests", label: "Requests", mobileLabel: "Requests", icon: Inbox },
  { to: "/connections", label: "Connections", mobileLabel: "Connections", icon: Users },
  { to: "/profile", label: "Profile", mobileLabel: "Profile", icon: User },
] as const;

export function StudentLayout({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const navigate = useNavigate();

  async function logout() {
    await authService.logout();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <Brand to="/dashboard" />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Student">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-accent text-accent-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" aria-label="Settings">
              <Link to="/settings">
                <Settings className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Log out" onClick={logout}>
              <LogOut className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-8 md:pb-14">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
        {children}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden"
        aria-label="Student mobile"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
                activeProps={{ className: "text-primary" }}
              >
                <item.icon className="size-5" aria-hidden="true" />
                {item.mobileLabel}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
