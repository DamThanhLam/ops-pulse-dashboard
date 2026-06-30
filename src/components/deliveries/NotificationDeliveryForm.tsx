import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CreateNotificationDeliveryRequest, DELIVERY_STATUS_OPTIONS, NotificationDeliveryStatus } from "@/types/notificationDelivery";
import { notificationDeliverySchema, NotificationDeliveryFormValues } from "@/validation/notificationDelivery.schema";
import { spacing } from "@/theme/spacing";
import { optionalText } from "@/utils/payload";

const statusOptions = DELIVERY_STATUS_OPTIONS.map((value) => ({ label: value, value }));

type Props = {
  loading?: boolean;
  onSubmit: (values: CreateNotificationDeliveryRequest) => Promise<void> | void;
};

export function NotificationDeliveryForm({ loading, onSubmit }: Props) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<NotificationDeliveryFormValues>({
    resolver: zodResolver(notificationDeliverySchema),
    defaultValues: {
      webhookEventId: "",
      routeId: "",
      destinationId: "",
      telegramChatId: "",
      telegramMessageId: "",
      messageText: "",
      status: "PENDING",
      maxAttempts: 3
    }
  });

  const submit = async (values: NotificationDeliveryFormValues) => {
    await onSubmit({
      webhookEventId: optionalText(values.webhookEventId),
      routeId: optionalText(values.routeId),
      destinationId: values.destinationId.trim(),
      telegramChatId: values.telegramChatId.trim(),
      telegramMessageId: optionalText(values.telegramMessageId),
      messageText: values.messageText.trim(),
      status: values.status ?? "PENDING",
      maxAttempts: Number(values.maxAttempts ?? 3)
    });
    reset();
  };

  return (
    <View style={styles.form}>
      <Controller control={control} name="webhookEventId" render={({ field }) => (
        <Input label="Webhook Event ID" value={field.value} onChangeText={field.onChange} />
      )} />
      <Controller control={control} name="routeId" render={({ field }) => (
        <Input label="Route ID" value={field.value} onChangeText={field.onChange} />
      )} />
      <Controller control={control} name="destinationId" render={({ field }) => (
        <Input label="Destination ID" value={field.value} onChangeText={field.onChange} error={errors.destinationId?.message} />
      )} />
      <Controller control={control} name="telegramChatId" render={({ field }) => (
        <Input label="Telegram Chat ID" value={field.value} onChangeText={field.onChange} error={errors.telegramChatId?.message} />
      )} />
      <Controller control={control} name="telegramMessageId" render={({ field }) => (
        <Input label="Telegram Message ID" value={field.value} onChangeText={field.onChange} />
      )} />
      <Controller control={control} name="messageText" render={({ field }) => (
        <Input label="Message Text" value={field.value} onChangeText={field.onChange} multiline error={errors.messageText?.message} />
      )} />
      <Controller control={control} name="status" render={({ field }) => (
        <Select<NotificationDeliveryStatus> label="Status" value={field.value} onChange={field.onChange} options={statusOptions} />
      )} />
      <Controller control={control} name="maxAttempts" render={({ field }) => (
        <Input label="Max Attempts" value={String(field.value ?? 3)} onChangeText={field.onChange} keyboardType="number-pad" error={errors.maxAttempts?.message} />
      )} />
      <Button title="Create delivery" loading={loading} onPress={handleSubmit(submit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg }
});
