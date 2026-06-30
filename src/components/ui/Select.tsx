import { Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";

export type SelectOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type SelectProps<TValue extends string> = {
  label: string;
  value?: TValue;
  options: SelectOption<TValue>[];
  onChange: (value: TValue) => void;
  error?: string;
  helperText?: string;
};

export function Select<TValue extends string>({
  label,
  value,
  options,
  onChange,
  error,
  helperText
}: SelectProps<TValue>) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                  opacity: pressed ? 0.82 : 1
                }
              ]}
            >
              <Text style={[styles.optionText, { color: selected ? "#FFFFFF" : colors.text }]}>
                {option.label}
              </Text>
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
    minHeight: 38,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    justifyContent: "center"
  },
  optionText: {
    fontSize: 13,
    fontWeight: "700"
  },
  helper: {
    fontSize: 12
  }
});
