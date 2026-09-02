import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Icon-prefixed search field shared by the dashboard filters and admin tables. */
export function SearchInput({
  id,
  value,
  onChange,
  placeholder = "Search",
  label,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        {...(id ? { id } : {})}
        type="search"
        className="pl-9"
        placeholder={placeholder}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
