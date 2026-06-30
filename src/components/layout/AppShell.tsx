import { PropsWithChildren } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { navItems } from "./navigation";
import { ToastHost } from "@/components/ui/ToastHost";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

export function AppShell({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const colors = useThemeColors();
  const isDesktop = width >= 900;
  const isStandaloneTelegramRegister = pathname === "/telegram/register";

  if (isStandaloneTelegramRegister) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.standaloneContent}>
          {children}
        </ScrollView>
        <ToastHost />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
      <View style={styles.root}>
        {isDesktop ? <Sidebar /> : null}
        <View style={styles.contentWrap}>
          <TopBar />
          <ScrollView
            contentContainerStyle={[
              styles.content,
              !isDesktop && styles.mobileContent,
              { paddingBottom: isDesktop ? spacing.xxl : 96 }
            ]}
          >
            {children}
          </ScrollView>
        </View>
        {!isDesktop ? (
          <View style={[styles.bottomNav, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Pressable key={String(item.href)} onPress={() => router.push(item.href)} style={styles.bottomNavItem}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={active ? colors.primary : colors.muted}
                  />
                  <Text numberOfLines={1} style={[styles.bottomNavText, { color: active ? colors.primary : colors.muted }]}>
                    {item.label.replace("Notification ", "")}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
      <ToastHost />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  root: {
    flex: 1,
    flexDirection: "row"
  },
  contentWrap: {
    flex: 1
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center"
  },
  mobileContent: {
    padding: spacing.lg
  },
  standaloneContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: "center",
    justifyContent: "center"
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 72,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.sm
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xs
  },
  bottomNavText: {
    fontSize: 10,
    fontWeight: "800"
  }
});
