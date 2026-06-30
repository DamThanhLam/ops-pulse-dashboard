import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { Input } from "@/components/ui/Input";
import { SwitchField } from "@/components/ui/SwitchField";
import { TELEGRAM_REGISTRATION_EVENT_OPTIONS } from "@/constants/telegramRegistration";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";
import { TelegramRegisterFormValues } from "@/types/telegramRegistration";
import { telegramRegistrationSchema } from "@/validation/telegramRegistration.schema";

type Props = {
  loading?: boolean;
  errorMessage?: string;
  onSubmit: (values: TelegramRegisterFormValues) => Promise<void> | void;
};

export function TelegramRegistrationForm({ loading, errorMessage, onSubmit }: Props) {
  const colors = useThemeColors();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<TelegramRegisterFormValues>({
    resolver: zodResolver(telegramRegistrationSchema),
    defaultValues: {
      repositoryFullName: "",
      eventTypes: ["push"],
      active: true
    }
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="repositoryFullName"
        render={({ field }) => (
          <Input
            label="Repository full name"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="owner/repo"
            helperText="Enter the GitHub repository already registered in Ops Pulse."
            error={errors.repositoryFullName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="eventTypes"
        render={({ field }) => (
          <CheckboxGroup
            label="Event types"
            value={field.value ?? []}
            onChange={field.onChange}
            options={TELEGRAM_REGISTRATION_EVENT_OPTIONS}
            helperText="Select the GitHub events this Telegram chat should receive."
            error={errors.eventTypes?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="active"
        render={({ field }) => (
          <SwitchField label="Active subscription" value={field.value ?? true} onValueChange={field.onChange} />
        )}
      />

      {errorMessage ? <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text> : null}

      <Button
        title={loading ? "Registering..." : "Complete registration"}
        loading={loading}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg
  },
  errorText: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  }
});
