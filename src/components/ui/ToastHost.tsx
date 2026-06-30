import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "@/hooks/useToast";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";

export function ToastHost() {
  const { toast, hideToast } = useToast();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  if (!toast) return null;

  const backgroundColor =
    toast.type === "success" ? colors.success : toast.type === "error" ? colors.error : colors.info;

  return (
    <Pressable
      onPress={hideToast}
      style={[
        styles.toast,
        {
          top: insets.top + spacing.md,
          backgroundColor
        }
      ]}
    >
      <Text style={styles.text}>{toast.message}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    right: spacing.lg,
    left: spacing.lg,
    zIndex: 999,
    maxWidth: 520,
    alignSelf: "center",
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 }
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center"
  }
});
