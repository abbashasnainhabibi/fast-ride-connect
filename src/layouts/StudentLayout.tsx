import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Inbox,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";

const NAV = [
  { to: "/dashboard", label: "Find Match", mobileLabel: "Match", icon: Search },
  { to: "/schedule", label: "My Schedule", mobileLabel: "Schedule", icon: CalendarDays },
  { to: "/requests", label: "Requests", mobileLabel: "Requests", icon: Inbox },
  { to: "/connections", label: "Connections", mobileLabel: "Rides", icon: Users },
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
  const [collapsed, setCollapsed] = useState(false);

  async function logout() {
    await authService.logout();
    navigate({ to: "/" });
  }

  const linkClass =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-card transition-[width] duration-150 ease-out md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className={cn("flex h-14 items-center border-b", collapsed ? "justify-center px-2" : "px-4")}>
          {collapsed ? (
            <Link
              to="/dashboard"
              aria-label="FAST Carpool dashboard"
              className="grid size-8 place-items-center rounded-lg bg-foreground text-xs font-bold text-background"
            >
              FC
            </Link>
          ) : (
            <Brand to="/dashboard" />
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Student">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={cn(linkClass, collapsed && "justify-center px-0")}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              {collapsed ? null : item.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 border-t p-3">
          <Link
            to="/settings"
            title={collapsed ? "Settings" : undefined}
            className={cn(linkClass, collapsed && "justify-center px-0")}
            activeProps={{ className: "bg-accent text-accent-foreground" }}
          >
            <Settings className="size-4 shrink-0" aria-hidden="true" />
            {collapsed ? null : "Settings"}
          </Link>
          <button
            type="button"
            onClick={logout}
            title={collapsed ? "Log out" : undefined}
            className={cn(linkClass, "w-full", collapsed && "justify-center px-0")}
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            {collapsed ? null : "Log out"}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(linkClass, "w-full text-xs", collapsed && "justify-center px-0")}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <>
                <PanelLeftClose className="size-4 shrink-0" aria-hidden="true" />
                Collapse
              </>
            )}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:hidden">
          <Brand to="/dashboard" />
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
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-8 sm:px-6 md:pb-14 lg:px-10">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              {description ? (
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {action}
          </div>
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden"
          aria-label="Student mobile"
        >
          <ul className="mx-auto grid max-w-lg grid-cols-5">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors duration-150 ease-out"
                  activeProps={{ className: "text-foreground" }}
                >
                  <item.icon className="size-5" aria-hidden="true" />
                  {item.mobileLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
