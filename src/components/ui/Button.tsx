import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style
}: ButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === "primary"
      ? colors.primary
      : variant === "danger"
        ? colors.error
        : variant === "secondary"
          ? colors.surfaceAlt
          : "transparent";

  const color = variant === "primary" || variant === "danger" ? "#FFFFFF" : colors.text;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor: variant === "ghost" ? "transparent" : colors.border,
          opacity: isDisabled ? 0.55 : pressed ? 0.84 : 1
        },
        style
      ]}
    >
      {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.text, { color }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1
  },
  text: {
    fontSize: 14,
    fontWeight: "700"
  }
});
