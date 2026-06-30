import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ title = "Unable to load data", message, onRetry }: ErrorStateProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.muted }]}>
        {message ?? "Check the API server and try again."}
      </Text>
      {onRetry ? <Button title="Retry" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center"
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20
  }
});
