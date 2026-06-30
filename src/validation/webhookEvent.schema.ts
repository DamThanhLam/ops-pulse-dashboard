import { z } from "zod";

export const webhookEventSchema = z.object({
  provider: z.enum(["GITHUB"]).default("GITHUB"),
  deliveryId: z.string().trim().min(1, "Delivery ID is required"),
  eventType: z.string().trim().min(1, "Event Type is required"),
  signature: z.string().trim().optional().or(z.literal("")),
  rawPayload: z.string().trim().default("{}"),
  processingStatus: z.enum(["RECEIVED", "PROCESSED", "IGNORED", "FAILED"]).default("RECEIVED"),
  receivedAt: z.string().trim().optional().or(z.literal(""))
});

export const githubWebhookTesterSchema = z.object({
  event: z.string().trim().min(1, "X-GitHub-Event is required"),
  deliveryId: z.string().trim().min(1, "X-GitHub-Delivery is required"),
  signature: z.string().trim().min(1, "X-Hub-Signature-256 is required"),
  rawPayload: z.string().trim().min(2, "Raw payload JSON is required")
});

export type WebhookEventFormValues = z.input<typeof webhookEventSchema>;
export type GithubWebhookTesterFormValues = z.input<typeof githubWebhookTesterSchema>;
