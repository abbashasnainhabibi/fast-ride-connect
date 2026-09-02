import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Label + control + hint/error triplet shared by every form in the app. */
export function Field({
  id,
  label,
  error,
  hint,
  children,
  labelSuffix,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children?: ReactNode;
  labelSuffix?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {labelSuffix}
      </div>
      <div className="mt-1">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** Field with a plain text input inside — the most common case. */
export function TextField({
  id,
  label,
  error,
  hint,
  labelSuffix,
  ...input
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  labelSuffix?: ReactNode;
} & ComponentProps<typeof Input>) {
  return (
    <Field id={id} label={label} error={error} hint={hint} labelSuffix={labelSuffix}>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...input}
      />
    </Field>
  );
}
