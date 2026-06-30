import { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { registerTelegramSubscription } from "@/api/telegramRegistrationApi";
import { TelegramRegistrationForm } from "@/components/telegram/TelegramRegistrationForm";
import { TelegramRegistrationSuccess } from "@/components/telegram/TelegramRegistrationSuccess";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/hooks/useToast";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";
import { TelegramRegisterFormValues, TelegramRegisterResponse } from "@/types/telegramRegistration";

export default function TelegramRegisterPage() {
  const colors = useThemeColors();
  const { showToast } = useToast();
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [result, setResult] = useState<TelegramRegisterResponse | null>(null);

  const sessionId = useMemo(() => {
    const raw = params.sessionId;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return typeof value === "string" ? value.trim() : "";
  }, [params.sessionId]);

  const submit = async (values: TelegramRegisterFormValues) => {
    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await registerTelegramSubscription({
        sessionId,
        repositoryFullName: values.repositoryFullName.trim(),
        eventTypes: Array.from(
          new Set(values.eventTypes.map((eventType) => eventType.trim().toLowerCase()).filter(Boolean))
        ),
        active: values.active ?? true
      });
      setResult(response);
      showToast("success", "Telegram registration completed successfully");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Failed to complete Telegram registration";
      setErrorMessage(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  if (!sessionId) {
    return (
      <View style={styles.page}>
        <View style={styles.content}>
          <Card>
            <ErrorState
              title="Invalid registration link"
              message="Invalid registration link. Please run /register again in Telegram."
            />
          </Card>
        </View>
      </View>
    );
  }

  if (result) {
    return (
      <View style={styles.page}>
        <View style={styles.content}>
          <TelegramRegistrationSuccess result={result} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <PageHeader
          title="Register Telegram Destination"
          description="Choose the GitHub repository and events this Telegram chat should receive notifications for."
        />

        <Card style={styles.card}>
          <View style={styles.steps}>
            <Text style={[styles.stepText, { color: colors.textSoft }]}>1. Telegram bot created a secure session.</Text>
            <Text style={[styles.stepText, { color: colors.textSoft }]}>2. You select repository and events.</Text>
            <Text style={[styles.stepText, { color: colors.textSoft }]}>3. Ops Pulse links this Telegram chat to GitHub notifications.</Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: `${colors.info}14`, borderColor: `${colors.info}55` }]}>
            <Text style={[styles.infoTitle, { color: colors.info }]}>Secure bot session</Text>
            <Text style={[styles.infoText, { color: colors.textSoft }]}>Telegram chat information is securely provided by the bot session. You do not need to enter chat ID manually.</Text>
            <Text style={[styles.infoText, { color: colors.textSoft }]}>This form only uses the session from Telegram. Chat identity is not editable.</Text>
          </View>

          <TelegramRegistrationForm loading={loading} errorMessage={errorMessage} onSubmit={submit} />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    alignItems: "center"
  },
  content: {
    width: "100%",
    maxWidth: 680,
    gap: spacing.xl
  },
  card: {
    gap: spacing.xl
  },
  steps: {
    gap: spacing.sm
  },
  stepText: {
    fontSize: 14,
    lineHeight: 21
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "900"
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20
  }
});
