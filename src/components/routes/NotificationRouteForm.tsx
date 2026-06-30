import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SwitchField } from "@/components/ui/SwitchField";
import { CreateNotificationRouteRequest, EVENT_TYPE_OPTIONS } from "@/types/notificationRoute";
import { notificationRouteSchema, NotificationRouteFormValues } from "@/validation/notificationRoute.schema";
import { spacing } from "@/theme/spacing";
import { optionalText } from "@/utils/payload";

const eventOptions = EVENT_TYPE_OPTIONS.map((value) => ({ label: value, value }));

type EventOption = typeof EVENT_TYPE_OPTIONS[number];

type Props = {
  loading?: boolean;
  onSubmit: (values: CreateNotificationRouteRequest) => Promise<void> | void;
};

export function NotificationRouteForm({ loading, onSubmit }: Props) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<NotificationRouteFormValues>({
    resolver: zodResolver(notificationRouteSchema),
    defaultValues: {
      repositoryId: "",
      destinationId: "",
      eventType: "push",
      active: true
    }
  });

  const submit = async (values: NotificationRouteFormValues) => {
    await onSubmit({
      repositoryId: optionalText(values.repositoryId),
      destinationId: values.destinationId.trim(),
      eventType: optionalText(values.eventType),
      active: values.active ?? true
    });
    reset();
  };

  return (
    <View style={styles.form}>
      <Controller control={control} name="repositoryId" render={({ field }) => (
        <Input label="Repository ID" value={field.value} onChangeText={field.onChange} helperText="UUID from backend repository record. Optional for global event route." />
      )} />
      <Controller control={control} name="destinationId" render={({ field }) => (
        <Input label="Destination ID" value={field.value} onChangeText={field.onChange} error={errors.destinationId?.message} />
      )} />
      <Controller control={control} name="eventType" render={({ field }) => (
        <Select<EventOption> label="Event Type" value={(field.value || "push") as EventOption} onChange={field.onChange} options={eventOptions} />
      )} />
      <Controller control={control} name="active" render={({ field }) => (
        <SwitchField label="Active" value={field.value ?? true} onValueChange={field.onChange} />
      )} />
      <Button title="Create route" loading={loading} onPress={handleSubmit(submit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg }
});
