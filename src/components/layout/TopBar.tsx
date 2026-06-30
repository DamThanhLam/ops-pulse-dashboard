import { StyleSheet, Text, View } from "react-native";
import { usePathname } from "expo-router";
import { titleFromPath } from "./navigation";
import { API_BASE_URL } from "@/api/apiClient";
import { Badge } from "@/components/ui/Badge";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

export function TopBar() {
  const colors = useThemeColors();
  const pathname = usePathname();
  const title = titleFromPath(pathname);

  return (
    <View style={[styles.container, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
      <View>
        <Text style={[styles.kicker, { color: colors.muted }]}>Ops Pulse Dashboard</Text>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.right}>
        <Badge label="API Ready" tone="success" />
        <Text numberOfLines={1} style={[styles.api, { color: colors.muted }]}>API: {API_BASE_URL}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 88,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg
  },
  kicker: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  title: {
    fontSize: 26,
    fontWeight: "900"
  },
  right: {
    alignItems: "flex-end",
    gap: spacing.xs,
    maxWidth: 360
  },
  api: {
    fontSize: 12
  }
});
