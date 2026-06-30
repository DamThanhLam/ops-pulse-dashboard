import { apiClient } from "./apiClient";
import { PageQueryParams, PaginatedResponse } from "@/types/api";
import { CreateNotificationRouteRequest, NotificationRoute } from "@/types/notificationRoute";
import { normalizePaginatedResponse } from "@/utils/pagination";

export type NotificationRouteListParams = PageQueryParams & {
  search?: string;
};

export const notificationRouteApi = {
  list: async (params: NotificationRouteListParams): Promise<PaginatedResponse<NotificationRoute>> => {
    const response = await apiClient.get<unknown>("/notification-routes", params);
    return normalizePaginatedResponse<NotificationRoute>(response, params);
  },

  create: (body: CreateNotificationRouteRequest) =>
    apiClient.post<NotificationRoute, CreateNotificationRouteRequest>("/notification/routes", body),

  getActive: (repositoryId: string, eventType: string) =>
    apiClient.get<NotificationRoute[]>("/notification/routes/active", { repositoryId, eventType }),

  getActiveByEvent: (eventType: string) =>
    apiClient.get<NotificationRoute[]>("/notification/routes/active-by-event", { eventType }),

  getEnabled: (githubRepoId: string, eventType: string) =>
    apiClient.get<NotificationRoute | boolean>("/notification/routes/enabled", { githubRepoId, eventType })
};
