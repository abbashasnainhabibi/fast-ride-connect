import type { ReactNode } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";

interface AsyncLike<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => void;
}

/**
 * Renders the loading / error / empty / ready states of a `useAsync` call so
 * every page does not repeat the same three conditional blocks.
 */
export function AsyncSection<T>({
  state,
  loadingLabel,
  loadingRows,
  loadingFallback,
  isEmpty,
  empty,
  children,
}: {
  state: AsyncLike<T>;
  loadingLabel?: string;
  loadingRows?: number;
  loadingFallback?: ReactNode;
  isEmpty?: (data: T) => boolean;
  empty?: { title: string; description?: string; icon?: ReactNode; action?: ReactNode };
  children: (data: T) => ReactNode;
}) {
  if (state.loading) {
    return <>{loadingFallback ?? <LoadingState label={loadingLabel} rows={loadingRows} />}</>;
  }
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
  if (state.data == null) return null;

  const isEmptyResult = isEmpty
    ? isEmpty(state.data)
    : Array.isArray(state.data) && state.data.length === 0;

  if (isEmptyResult && empty) {
    return (
      <EmptyState
        title={empty.title}
        {...(empty.description ? { description: empty.description } : {})}
        {...(empty.icon ? { icon: empty.icon } : {})}
        {...(empty.action ? { action: empty.action } : {})}
      />
    );
  }

  return <>{children(state.data)}</>;
}
