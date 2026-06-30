import { z } from "zod";

const repositoryFullNamePattern = /^[^\s/]+\/[^\s/]+$/;

export const telegramRegistrationSchema = z.object({
  repositoryFullName: z
    .string()
    .trim()
    .min(1, "Repository full name is required")
    .max(200, "Repository full name must be at most 200 characters")
    .refine((value) => repositoryFullNamePattern.test(value), {
      message: "Repository full name must use owner/repo format"
    })
    .refine((value) => value.split("/")[0]?.trim().length > 0, {
      message: "Repository owner cannot be blank"
    })
    .refine((value) => value.split("/")[1]?.trim().length > 0, {
      message: "Repository name cannot be blank"
    }),
  eventTypes: z.array(z.string().trim().min(1)).min(1, "Select at least one event type"),
  active: z.boolean()
});

export type TelegramRegistrationFormValues = z.input<typeof telegramRegistrationSchema>;
