import { z } from "zod";

export const telegramDestinationSchema = z.object({
  chatId: z.string().trim().min(1, "Chat ID is required"),
  chatType: z.enum(["PRIVATE", "GROUP", "SUPERGROUP", "CHANNEL"]),
  title: z.string().trim().optional().or(z.literal("")),
  username: z.string().trim().optional().or(z.literal("")),
  active: z.boolean().default(true)
});

export type TelegramDestinationFormValues = z.input<typeof telegramDestinationSchema>;
