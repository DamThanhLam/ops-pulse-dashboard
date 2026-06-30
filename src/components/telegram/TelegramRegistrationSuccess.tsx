import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";
import { TelegramRegisterResponse } from "@/types/telegramRegistration";

type Props = {
  result: TelegramRegisterResponse;
};

export function TelegramRegistrationSuccess({ result }: Props) {
  const colors = useThemeColors();

  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${colors.success}1A` }]}>
        <Text style={[styles.icon, { color: colors.success }]}>✓</Text>
      </View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Telegram destination registered</Text>
        <Text style={[styles.description, { color: colors.textSoft }]}>This Telegram chat is now linked to GitHub notifications in Ops Pulse.</Text>
      </View>

      <View style={[styles.summary, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Repository</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{result.repositoryFullName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Event types</Text>
          <View style={styles.badgeRow}>
            {result.eventTypes.map((eventType) => (
              <Badge key={eventType} label={eventType} tone="info" />
            ))}
          </View>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Status</Text>
          <Badge label={result.active ? "ACTIVE" : "INACTIVE"} tone={result.active ? "success" : "neutral"} />
        </View>
      </View>

      <Button title="Back to dashboard" variant="secondary" onPress={() => router.push("/")} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
    alignItems: "stretch"
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  icon: {
    fontSize: 28,
    fontWeight: "900"
  },
  header: {
    gap: spacing.sm,
    alignItems: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center"
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center"
  },
  summary: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md
  },
  summaryRow: {
    gap: spacing.xs
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "800"
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  }
});
