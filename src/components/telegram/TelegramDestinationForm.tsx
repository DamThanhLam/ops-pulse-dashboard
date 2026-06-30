import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SwitchField } from "@/components/ui/SwitchField";
import { CreateTelegramDestinationRequest, TelegramChatType } from "@/types/telegramDestination";
import { telegramDestinationSchema, TelegramDestinationFormValues } from "@/validation/telegramDestination.schema";
import { spacing } from "@/theme/spacing";
import { optionalText } from "@/utils/payload";

const chatTypeOptions: { label: string; value: TelegramChatType }[] = [
  { label: "PRIVATE", value: "PRIVATE" },
  { label: "GROUP", value: "GROUP" },
  { label: "SUPERGROUP", value: "SUPERGROUP" },
  { label: "CHANNEL", value: "CHANNEL" }
];

type Props = {
  loading?: boolean;
  onSubmit: (values: CreateTelegramDestinationRequest) => Promise<void> | void;
};

export function TelegramDestinationForm({ loading, onSubmit }: Props) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<TelegramDestinationFormValues>({
    resolver: zodResolver(telegramDestinationSchema),
    defaultValues: {
      chatId: "",
      chatType: "CHANNEL",
      title: "",
      username: "",
      active: true
    }
  });

  const submit = async (values: TelegramDestinationFormValues) => {
    await onSubmit({
      chatId: values.chatId.trim(),
      chatType: values.chatType,
      title: optionalText(values.title),
      username: optionalText(values.username),
      active: values.active ?? true
    });
    reset();
  };

  return (
    <View style={styles.form}>
      <Controller control={control} name="chatId" render={({ field }) => (
        <Input label="Chat ID" value={field.value} onChangeText={field.onChange} error={errors.chatId?.message} />
      )} />
      <Controller control={control} name="chatType" render={({ field }) => (
        <Select label="Chat Type" value={field.value} onChange={field.onChange} options={chatTypeOptions} error={errors.chatType?.message} />
      )} />
      <Controller control={control} name="title" render={({ field }) => (
        <Input label="Title" value={field.value} onChangeText={field.onChange} />
      )} />
      <Controller control={control} name="username" render={({ field }) => (
        <Input label="Username" value={field.value} onChangeText={field.onChange} />
      )} />
      <Controller control={control} name="active" render={({ field }) => (
        <SwitchField label="Active" value={field.value ?? true} onValueChange={field.onChange} />
      )} />
      <Button title="Create destination" loading={loading} onPress={handleSubmit(submit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg }
});
