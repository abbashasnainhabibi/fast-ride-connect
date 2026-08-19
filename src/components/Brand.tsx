import { Link } from "@tanstack/react-router";
import { CarFront } from "lucide-react";

export function Brand({ to = "/", tone = "dark" }: { to?: string; tone?: "dark" | "light" }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-md" aria-label="FAST Carpool home">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <CarFront className="size-4" aria-hidden="true" />
      </span>
      <span
        className={
          tone === "light"
            ? "font-display text-lg font-bold text-navy-foreground"
            : "font-display text-lg font-bold text-foreground"
        }
      >
        FAST Carpool
      </span>
    </Link>
  );
}
