import { TelegramChatType } from "./telegramDestination";

export type CreateNotificationRouteRequest = {
  repositoryId?: string;
  destinationId: string;
  eventType?: string;
  active?: boolean;
};

export type NotificationRoute = CreateNotificationRouteRequest & {
  id?: string;
  routeId?: string;
  githubRepoId?: string | number;
  githubRepositoryId?: string | number;
  githubRepositoryName?: string;
  githubRepoName?: string;
  repositoryName?: string;
  githubRepositoryFullName?: string;
  githubRepoFullName?: string;
  repositoryFullName?: string;
  destinationUsername?: string;
  telegramDestinationUsername?: string;
  telegramUsername?: string;
  telegramChatType?: TelegramChatType;
  chatType?: TelegramChatType;
  enabled?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const EVENT_TYPE_OPTIONS = [
  "push",
  "pull_request",
  "issues",
  "release",
  "workflow_run"
] as const;
