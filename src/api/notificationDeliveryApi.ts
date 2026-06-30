import { apiClient } from "./apiClient";
import { PageQueryParams, PaginatedResponse } from "@/types/api";
import {
  CreateNotificationDeliveryRequest,
  NotificationDelivery,
  NotificationDeliveryStatus
} from "@/types/notificationDelivery";
import { normalizePaginatedResponse } from "@/utils/pagination";

export type NotificationDeliveryListParams = PageQueryParams & {
  status?: NotificationDeliveryStatus;
  destinationUsername?: string;
  githubRepoName?: string;
};

export const notificationDeliveryApi = {
  list: async (params: NotificationDeliveryListParams): Promise<PaginatedResponse<NotificationDelivery>> => {
    const response = await apiClient.get<unknown>("/notification-deliveries", params);
    return normalizePaginatedResponse<NotificationDelivery>(response, params);
  },

  create: (body: CreateNotificationDeliveryRequest) =>
    apiClient.post<NotificationDelivery, CreateNotificationDeliveryRequest>("/notification/deliveries", body),

  getByStatus: (status?: NotificationDeliveryStatus) =>
    apiClient.get<NotificationDelivery[]>("/notification/deliveries", { status }),

  getRetryable: (status: NotificationDeliveryStatus, now: string) =>
    apiClient.get<NotificationDelivery[]>("/notification/deliveries/retryable", { status, now })
};
