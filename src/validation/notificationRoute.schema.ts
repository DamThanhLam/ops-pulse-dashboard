import { z } from "zod";

export const notificationRouteSchema = z.object({
  repositoryId: z.string().trim().optional().or(z.literal("")),
  destinationId: z.string().trim().min(1, "Destination ID is required"),
  eventType: z.string().trim().optional().or(z.literal("")),
  active: z.boolean().default(true)
});

export type NotificationRouteFormValues = z.input<typeof notificationRouteSchema>;
