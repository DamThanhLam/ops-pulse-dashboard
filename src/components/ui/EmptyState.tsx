import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {description ? <Text style={[styles.description, { color: colors.muted }]}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.sm
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center"
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20
  }
});
