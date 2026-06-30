import { z } from "zod";

export const notificationDeliverySchema = z.object({
  webhookEventId: z.string().trim().optional().or(z.literal("")),
  routeId: z.string().trim().optional().or(z.literal("")),
  destinationId: z.string().trim().min(1, "Destination ID is required"),
  telegramChatId: z.string().trim().min(1, "Telegram Chat ID is required"),
  telegramMessageId: z.string().trim().optional().or(z.literal("")),
  messageText: z.string().trim().min(1, "Message text is required"),
  status: z.enum(["PENDING", "SENT", "FAILED", "RETRYING", "SKIPPED"]).default("PENDING"),
  maxAttempts: z.coerce.number().int().min(1).max(20).default(3)
});

export type NotificationDeliveryFormValues = z.input<typeof notificationDeliverySchema>;
