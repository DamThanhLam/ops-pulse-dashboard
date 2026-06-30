import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CreateWebhookEventRequest, WebhookProcessingStatus, WEBHOOK_STATUS_OPTIONS } from "@/types/webhookEvent";
import { webhookEventSchema, WebhookEventFormValues } from "@/validation/webhookEvent.schema";
import { spacing } from "@/theme/spacing";
import { optionalText } from "@/utils/payload";

const statusOptions = WEBHOOK_STATUS_OPTIONS.map((value) => ({ label: value, value }));

type Props = {
  loading?: boolean;
  onSubmit: (values: CreateWebhookEventRequest) => Promise<void> | void;
};

export function WebhookEventForm({ loading, onSubmit }: Props) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<WebhookEventFormValues>({
    resolver: zodResolver(webhookEventSchema),
    defaultValues: {
      provider: "GITHUB",
      deliveryId: "",
      eventType: "push",
      signature: "",
      rawPayload: "{}",
      processingStatus: "RECEIVED",
      receivedAt: ""
    }
  });

  const submit = async (values: WebhookEventFormValues) => {
    await onSubmit({
      provider: values.provider ?? "GITHUB",
      deliveryId: values.deliveryId.trim(),
      eventType: values.eventType.trim(),
      signature: optionalText(values.signature),
      rawPayload: optionalText(values.rawPayload) ?? "{}",
      processingStatus: values.processingStatus ?? "RECEIVED",
      receivedAt: optionalText(values.receivedAt)
    });
    reset();
  };

  return (
    <View style={styles.form}>
      <Controller control={control} name="provider" render={({ field }) => (
        <Select label="Provider" value={field.value} onChange={field.onChange} options={[{ label: "GITHUB", value: "GITHUB" }]} />
      )} />
      <Controller control={control} name="deliveryId" render={({ field }) => (
        <Input label="Delivery ID" value={field.value} onChangeText={field.onChange} error={errors.deliveryId?.message} />
      )} />
      <Controller control={control} name="eventType" render={({ field }) => (
        <Input label="Event Type" value={field.value} onChangeText={field.onChange} error={errors.eventType?.message} />
      )} />
      <Controller control={control} name="signature" render={({ field }) => (
        <Input label="Signature" value={field.value} onChangeText={field.onChange} />
      )} />
      <Controller control={control} name="rawPayload" render={({ field }) => (
        <Input label="Raw Payload" value={field.value} onChangeText={field.onChange} multiline helperText="JSON string. Defaults to {} when empty." />
      )} />
      <Controller control={control} name="processingStatus" render={({ field }) => (
        <Select<WebhookProcessingStatus> label="Processing Status" value={field.value} onChange={field.onChange} options={statusOptions} />
      )} />
      <Controller control={control} name="receivedAt" render={({ field }) => (
        <Input label="Received At" value={field.value} onChangeText={field.onChange} placeholder="2026-06-29T00:00:00Z" />
      )} />
      <Button title="Create webhook event" loading={loading} onPress={handleSubmit(submit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg }
});
