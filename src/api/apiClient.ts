import axios, { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types/api";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "/api/v1";

export type ApiQueryParams = Record<string, string | number | boolean | null | undefined>;

export class ApiClientError extends Error {
  status?: number;
  code?: string | number;
  details?: unknown;

  constructor(message: string, status?: number, code?: string | number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

function hasEnvelopeShape<T>(payload: unknown): payload is ApiResponse<T> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    ("data" in payload || "success" in payload || "message" in payload || "code" in payload)
  );
}

function unwrapResponse<T>(payload: unknown): T {
  if (hasEnvelopeShape<T>(payload) && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}

function normalizeError(error: unknown): ApiClientError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    const status = axiosError.response?.status;
    const payload = axiosError.response?.data;
    const message =
      payload?.message ??
      axiosError.message ??
      "Unexpected API error";

    return new ApiClientError(message, status, payload?.code, payload);
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message);
  }

  return new ApiClientError("Unexpected API error");
}

function cleanParams(params?: ApiQueryParams) {
  if (!params) return undefined;

  return Object.entries(params).reduce<Record<string, string | number | boolean>>((acc, [key, value]) => {
    if (value === undefined || value === null || value === "") return acc;
    acc[key] = value;
    return acc;
  }, {});
}

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers = config.headers ?? new AxiosHeaders();
  config.headers.set("Accept", "application/json");
  config.headers.set("Content-Type", "application/json");

  if (API_BASE_URL.includes("ngrok-free.app")) {
    config.headers.set("ngrok-skip-browser-warning", "true");
  }

  return config;
});

client.interceptors.response.use(
  (response: AxiosResponse<unknown>) => unwrapResponse(response.data),
  (error: unknown) => Promise.reject(normalizeError(error))
);

export const apiClient = {
  get: <T>(url: string, params?: ApiQueryParams) =>
    client.get<unknown, T>(url, { params: cleanParams(params) }),
  post: <T, B = unknown>(url: string, body?: B, headers?: Record<string, string>) =>
    client.post<unknown, T>(url, body, headers ? { headers } : undefined),
  put: <T, B = unknown>(url: string, body?: B) =>
    client.put<unknown, T>(url, body),
  delete: <T>(url: string) => client.delete<unknown, T>(url)
};
