import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { navItems } from "./navigation";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";

export function Sidebar() {
  const pathname = usePathname();
  const colors = useThemeColors();

  return (
    <View style={[styles.sidebar, { backgroundColor: colors.surface, borderRightColor: colors.border }]}>
      <View style={styles.brandRow}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <Ionicons name="pulse" size={20} color="#FFFFFF" />
        </View>
        <View>
          <Text style={[styles.brand, { color: colors.text }]}>Ops Pulse</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Control Center</Text>
        </View>
      </View>

      <View style={styles.navList}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Pressable
              key={String(item.href)}
              onPress={() => router.push(item.href)}
              style={({ pressed }) => [
                styles.navItem,
                {
                  backgroundColor: active ? `${colors.primary}1A` : "transparent",
                  opacity: pressed ? 0.72 : 1
                }
              ]}
            >
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={19}
                color={active ? colors.primary : colors.muted}
              />
              <Text style={[styles.navText, { color: active ? colors.primary : colors.textSoft }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 292,
    borderRightWidth: 1,
    padding: spacing.xl,
    gap: spacing.xl
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center"
  },
  brand: {
    fontSize: 18,
    fontWeight: "900"
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700"
  },
  navList: {
    gap: spacing.sm
  },
  navItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md
  },
  navText: {
    fontSize: 14,
    fontWeight: "800"
  }
});
