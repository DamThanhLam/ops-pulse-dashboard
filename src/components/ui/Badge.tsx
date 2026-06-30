import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";

type BadgeTone = "neutral" | "success" | "warning" | "error" | "info";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const colors = useThemeColors();
  const color =
    tone === "success"
      ? colors.success
      : tone === "warning"
        ? colors.warning
        : tone === "error"
          ? colors.error
          : tone === "info"
            ? colors.info
            : colors.muted;

  return (
    <View style={[styles.badge, { backgroundColor: `${color}1A`, borderColor: `${color}55` }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

export function statusTone(status?: string): BadgeTone {
  switch (status) {
    case "SENT":
    case "PROCESSED":
      return "success";
    case "PENDING":
    case "RECEIVED":
      return "warning";
    case "FAILED":
      return "error";
    case "RETRYING":
      return "info";
    default:
      return "neutral";
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  text: {
    fontSize: 12,
    fontWeight: "800"
  }
});
