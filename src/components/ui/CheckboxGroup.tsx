import { Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";

export type CheckboxGroupOption = {
  label: string;
  value: string;
};

type CheckboxGroupProps = {
  label: string;
  value: string[];
  options: CheckboxGroupOption[];
  onChange: (value: string[]) => void;
  error?: string;
  helperText?: string;
};

export function CheckboxGroup({ label, value, options, onChange, error, helperText }: CheckboxGroupProps) {
  const colors = useThemeColors();

  const toggle = (optionValue: string) => {
    const selected = value.includes(optionValue);
    onChange(selected ? value.filter((current) => current !== optionValue) : [...value, optionValue]);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = value.includes(option.value);
          return (
            <Pressable
              key={option.value}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={option.label}
              onPress={() => toggle(option.value)}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                  opacity: pressed ? 0.82 : 1
                }
              ]}
            >
              <View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: selected ? "#FFFFFF" : "transparent",
                    borderColor: selected ? "#FFFFFF" : colors.muted
                  }
                ]}
              >
                {selected ? <Text style={[styles.check, { color: colors.primary }]}>✓</Text> : null}
              </View>
              <Text style={[styles.optionText, { color: selected ? "#FFFFFF" : colors.text }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {helperText && !error ? <Text style={[styles.helper, { color: colors.muted }]}>{helperText}</Text> : null}
      {error ? <Text style={[styles.helper, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    width: "100%"
  },
  label: {
    fontSize: 13,
    fontWeight: "700"
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  option: {
    minHeight: 42,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  indicator: {
    width: 18,
    height: 18,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  check: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14
  },
  optionText: {
    fontSize: 13,
    fontWeight: "700"
  },
  helper: {
    fontSize: 12
  }
});
