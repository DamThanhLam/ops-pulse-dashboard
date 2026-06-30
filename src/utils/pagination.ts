import { PageQueryParams, PaginatedResponse } from "@/types/api";

type BackendPage<T> = Partial<PaginatedResponse<T>> & {
  content?: T[];
  data?: T[];
  results?: T[];
  records?: T[];
  number?: number;
  total?: number;
  totalItems?: number;
  totalCount?: number;
  count?: number;
  first?: boolean;
  last?: boolean;
};

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizePaginatedResponse<T>(payload: unknown, params: Pick<PageQueryParams, "page" | "size">): PaginatedResponse<T> {
  if (Array.isArray(payload)) {
    const totalElements = payload.length;
    const totalPages = params.size > 0 ? Math.ceil(totalElements / params.size) : 1;
    return {
      items: payload as T[],
      page: params.page,
      size: params.size,
      totalElements,
      totalPages,
      hasNext: false,
      hasPrevious: params.page > 0
    };
  }

  const page = (payload ?? {}) as BackendPage<T>;
  const items = page.items ?? page.content ?? page.data ?? page.results ?? page.records ?? [];
  const currentPage = asNumber(page.page, asNumber(page.number, params.page));
  const currentSize = asNumber(page.size, params.size);
  const totalElements = asNumber(
    page.totalElements,
    asNumber(page.total, asNumber(page.totalItems, asNumber(page.totalCount, asNumber(page.count, items.length))))
  );
  const totalPages = asNumber(
    page.totalPages,
    currentSize > 0 ? Math.max(1, Math.ceil(totalElements / currentSize)) : 1
  );

  return {
    items,
    page: currentPage,
    size: currentSize,
    totalElements,
    totalPages,
    hasNext: typeof page.hasNext === "boolean" ? page.hasNext : page.last === false || currentPage < totalPages - 1,
    hasPrevious: typeof page.hasPrevious === "boolean" ? page.hasPrevious : page.first === false || currentPage > 0
  };
}
