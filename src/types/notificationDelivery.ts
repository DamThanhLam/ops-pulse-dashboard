export type NotificationDeliveryStatus =
  | "PENDING"
  | "SENT"
  | "FAILED"
  | "RETRYING"
  | "SKIPPED";

export type CreateNotificationDeliveryRequest = {
  webhookEventId?: string;
  routeId?: string;
  destinationId: string;
  telegramChatId: string;
  telegramMessageId?: string;
  messageText: string;
  status?: NotificationDeliveryStatus;
  maxAttempts?: number;
};

export type NotificationDelivery = CreateNotificationDeliveryRequest & {
  id?: string;
  deliveryId?: string;
  githubRepositoryName?: string;
  githubRepoName?: string;
  repositoryName?: string;
  destinationUsername?: string;
  telegramDestinationUsername?: string;
  telegramUsername?: string;
  eventType?: string;
  attemptCount?: number;
  retryCount?: number;
  errorMessage?: string;
  nextRetryAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const DELIVERY_STATUS_OPTIONS: NotificationDeliveryStatus[] = [
  "PENDING",
  "SENT",
  "FAILED",
  "RETRYING",
  "SKIPPED"
];
