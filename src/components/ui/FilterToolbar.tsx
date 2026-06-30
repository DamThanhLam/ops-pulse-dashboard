import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/theme/spacing";

export function FilterToolbar({ children }: PropsWithChildren) {
  return <View style={styles.toolbar}>{children}</View>;
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: spacing.lg
  }
});
