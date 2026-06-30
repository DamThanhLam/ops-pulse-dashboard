import { Switch, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

type SwitchFieldProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function SwitchField({ label, value, onValueChange }: SwitchFieldProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  label: {
    fontSize: 14,
    fontWeight: "700"
  }
});
