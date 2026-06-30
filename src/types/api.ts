export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  code?: string | number;
};

export type ApiErrorPayload = {
  message: string;
  status?: number;
  code?: string | number;
  details?: unknown;
};

export type SortDir = "asc" | "desc";

export type PageQueryParams = {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: SortDir;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};
