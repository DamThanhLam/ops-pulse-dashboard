import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
};

export function Input({ label, error, helperText, multiline, style, ...props }: InputProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[
          styles.input,
          multiline && styles.textarea,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text
          },
          style
        ]}
        {...props}
      />
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
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 14
  },
  textarea: {
    minHeight: 116,
    paddingTop: spacing.md
  },
  helper: {
    fontSize: 12
  }
});
