import { apiClient } from "./apiClient";
import { PageQueryParams, PaginatedResponse } from "@/types/api";
import { CreateTelegramDestinationRequest, TelegramChatType, TelegramDestination } from "@/types/telegramDestination";
import { normalizePaginatedResponse } from "@/utils/pagination";

export type TelegramDestinationListParams = PageQueryParams & {
  search?: string;
  chatType?: TelegramChatType;
};

export const telegramDestinationApi = {
  list: async (params: TelegramDestinationListParams): Promise<PaginatedResponse<TelegramDestination>> => {
    const response = await apiClient.get<unknown>("/telegram/destinations", params);
    return normalizePaginatedResponse<TelegramDestination>(response, params);
  },

  create: (body: CreateTelegramDestinationRequest) =>
    apiClient.post<TelegramDestination, CreateTelegramDestinationRequest>("/telegram/destinations", body),

  getEnabled: (destinationId: string) =>
    apiClient.get<TelegramDestination | boolean>(
      `/telegram/destinations/${encodeURIComponent(destinationId)}/enabled`
    )
};
