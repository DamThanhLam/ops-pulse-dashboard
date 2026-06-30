import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, spacing } from "@/theme/spacing";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const colors = useThemeColors();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={onCancel}>
        <Pressable style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSoft }]}>{message}</Text>
          <View style={styles.actions}>
            <Button title={cancelText} variant="secondary" onPress={onCancel} />
            <Button title={confirmText} variant="danger" onPress={onConfirm} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md
  },
  title: {
    fontSize: 20,
    fontWeight: "900"
  },
  message: {
    fontSize: 14,
    lineHeight: 21
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
    marginTop: spacing.sm
  }
});
