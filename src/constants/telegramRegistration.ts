export type TelegramRegistrationEventOption = {
  label: string;
  value: string;
};

export const TELEGRAM_REGISTRATION_EVENT_OPTIONS: TelegramRegistrationEventOption[] = [
  { label: "Push", value: "push" },
  { label: "Pull request", value: "pull_request" },
  { label: "Issues", value: "issues" },
  { label: "Release", value: "release" }
];
