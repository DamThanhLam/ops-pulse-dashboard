import { apiClient } from "./apiClient";
import { PageQueryParams, PaginatedResponse } from "@/types/api";
import { CreateWebhookEventRequest, GithubWebhookHeaders, WebhookEvent } from "@/types/webhookEvent";
import { normalizePaginatedResponse } from "@/utils/pagination";

export type WebhookEventListParams = PageQueryParams & {
  search?: string;
};

export const webhookEventApi = {
  list: async (params: WebhookEventListParams): Promise<PaginatedResponse<WebhookEvent>> => {
    const response = await apiClient.get<unknown>("/webhook-events", params);
    return normalizePaginatedResponse<WebhookEvent>(response, params);
  },

  create: (body: CreateWebhookEventRequest) =>
    apiClient.post<WebhookEvent, CreateWebhookEventRequest>("/webhook-events", body),

  getByDeliveryId: (deliveryId: string) =>
    apiClient.get<WebhookEvent>(`/webhook-events/${encodeURIComponent(deliveryId)}`),

  exists: (deliveryId: string) =>
    apiClient.get<boolean>(`/webhook-events/${encodeURIComponent(deliveryId)}/exists`),

  testGithubWebhook: (headers: GithubWebhookHeaders, rawPayload: string) =>
    apiClient.post<unknown, string>("/webhooks/github", rawPayload, {
      "Content-Type": "application/json",
      "X-GitHub-Event": headers.event,
      "X-GitHub-Delivery": headers.deliveryId,
      "X-Hub-Signature-256": headers.signature
    })
};
