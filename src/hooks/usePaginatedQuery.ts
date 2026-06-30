import { useCallback, useEffect, useRef, useState } from "react";
import { PageQueryParams, PaginatedResponse } from "@/types/api";

const emptyPage = <T,>(page: number, size: number): PaginatedResponse<T> => ({
  items: [],
  page,
  size,
  totalElements: 0,
  totalPages: 1,
  hasNext: false,
  hasPrevious: page > 0
});

export function usePaginatedQuery<T>(
  queryKey: string,
  params: PageQueryParams,
  fetcher: () => Promise<PaginatedResponse<T>>
) {
  const [data, setData] = useState<PaginatedResponse<T>>(() => emptyPage<T>(params.page, params.size));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (requestId.current === currentRequest) {
        setData(result);
      }
    } catch (caught) {
      if (requestId.current === currentRequest) {
        setError(caught instanceof Error ? caught : new Error("Failed to load data"));
      }
    } finally {
      if (requestId.current === currentRequest) {
        setLoading(false);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    void load();
  }, [load, queryKey]);

  return { data, loading, error, retry: load };
}
