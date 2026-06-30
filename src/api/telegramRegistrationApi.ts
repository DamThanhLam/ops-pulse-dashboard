import { apiClient } from "./apiClient";
import { TelegramRegisterRequest, TelegramRegisterResponse } from "@/types/telegramRegistration";

export function registerTelegramSubscription(payload: TelegramRegisterRequest): Promise<TelegramRegisterResponse> {
  return apiClient.post<TelegramRegisterResponse, TelegramRegisterRequest>("/telegram/register", payload);
}
