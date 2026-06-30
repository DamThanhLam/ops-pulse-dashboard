export type TelegramRegisterRequest = {
  sessionId: string;
  repositoryFullName: string;
  eventTypes: string[];
  active?: boolean;
};

export type TelegramRegisterResponse = {
  destinationId: string;
  repositoryId: string;
  repositoryFullName: string;
  createdRouteIds: string[];
  eventTypes: string[];
  active: boolean;
};

export type TelegramRegisterFormValues = {
  repositoryFullName: string;
  eventTypes: string[];
  active: boolean;
};
