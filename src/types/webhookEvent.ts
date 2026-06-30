export type WebhookProvider = "GITHUB";

export type WebhookProcessingStatus =
  | "RECEIVED"
  | "PROCESSED"
  | "IGNORED"
  | "FAILED";

export type CreateWebhookEventRequest = {
  provider?: WebhookProvider;
  deliveryId: string;
  eventType: string;
  signature?: string;
  rawPayload?: string;
  processingStatus?: WebhookProcessingStatus;
  receivedAt?: string;
};

export type WebhookEvent = CreateWebhookEventRequest & {
  id?: string;
  webhookEventId?: string;
  repositoryId?: string;
  githubRepoId?: string | number;
  githubRepositoryId?: string | number;
  githubRepositoryName?: string;
  githubRepoName?: string;
  repositoryName?: string;
  routeId?: string;
  destinationUsername?: string;
  telegramDestinationUsername?: string;
  telegramUsername?: string;
  status?: string;
  result?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GithubWebhookHeaders = {
  event: string;
  deliveryId: string;
  signature: string;
};

export const WEBHOOK_STATUS_OPTIONS: WebhookProcessingStatus[] = [
  "RECEIVED",
  "PROCESSED",
  "IGNORED",
  "FAILED"
];
