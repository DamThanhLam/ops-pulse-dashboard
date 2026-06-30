export type TelegramChatType = "PRIVATE" | "GROUP" | "SUPERGROUP" | "CHANNEL";

export type CreateTelegramDestinationRequest = {
  chatId: string;
  chatType: TelegramChatType;
  title?: string;
  username?: string;
  active?: boolean;
};

export type TelegramDestination = CreateTelegramDestinationRequest & {
  id?: string;
  destinationId?: string;
  displayName?: string;
  status?: string;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
