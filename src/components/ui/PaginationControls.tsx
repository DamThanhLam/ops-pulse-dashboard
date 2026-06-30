import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { Select } from "./Select";
import { PaginatedResponse } from "@/types/api";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

const pageSizeOptions = [10, 20, 50, 100].map((value) => ({ label: `${value} / page`, value: String(value) }));

type Props<T> = {
  page: PaginatedResponse<T>;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading?: boolean;
};

export function PaginationControls<T>({ page, pageSize, onPageChange, onPageSizeChange, loading }: Props<T>) {
  const colors = useThemeColors();
  const from = page.totalElements === 0 ? 0 : page.page * page.size + 1;
  const to = Math.min(page.totalElements, page.page * page.size + page.items.length);
  const totalPages = Math.max(1, page.totalPages);

  return (
    <View style={styles.container}>
      <Text style={[styles.summary, { color: colors.muted }]}>Showing {from}-{to} of {page.totalElements} · Page {page.page + 1} of {totalPages}</Text>
      <View style={styles.actions}>
        <Button title="Previous" variant="secondary" disabled={loading || !page.hasPrevious} onPress={() => onPageChange(Math.max(0, page.page - 1))} />
        <Button title="Next" variant="secondary" disabled={loading || !page.hasNext} onPress={() => onPageChange(page.page + 1)} />
        <View style={styles.sizeSelect}>
          <Select label="Page size" value={String(pageSize)} options={pageSizeOptions} onChange={(value) => onPageSizeChange(Number(value))} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.lg
  },
  actions: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: spacing.md
  },
  sizeSelect: {
    minWidth: 170
  },
  summary: {
    fontSize: 13,
    fontWeight: "700"
  }
});
