import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

export function LoadingState({ label = "Loading data..." }: { label?: string }) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md
  },
  label: {
    fontSize: 14
  }
});
