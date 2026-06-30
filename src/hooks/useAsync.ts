import { useCallback, useState } from "react";

export function useAsync<TArgs extends unknown[], TResult>(
  asyncFn: (...args: TArgs) => Promise<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        return await asyncFn(...args);
      } catch (caught) {
        const normalized = caught instanceof Error ? caught : new Error("Unexpected error");
        setError(normalized);
        throw normalized;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn]
  );

  return { execute, loading, error };
}
