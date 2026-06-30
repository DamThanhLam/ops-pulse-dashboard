import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { TelegramDestination } from "@/types/telegramDestination";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";
import { displayValue, formatDateTime, shortId } from "@/utils/format";

type Props = { items: TelegramDestination[] };

function activeLabel(item: TelegramDestination) {
  const active = item.active ?? item.enabled;
  if (typeof active === "boolean") return active ? "ACTIVE" : "INACTIVE";
  return item.status ?? "UNKNOWN";
}

export function TelegramDestinationList({ items }: Props) {
  const { width } = useWindowDimensions();
  const colors = useThemeColors();
  const desktop = width >= 860;

  if (items.length === 0) {
    return <EmptyState title="No Telegram destinations" description="No destination matched the current filters." />;
  }

  if (!desktop) {
    return (
      <View style={styles.stack}>
        {items.map((item, index) => {
          const active = item.active ?? item.enabled;
          return (
            <Card key={item.id ?? item.destinationId ?? item.chatId ?? String(index)} style={styles.card}>
              <Text style={[styles.title, { color: colors.text }]}>{displayValue(item.title ?? item.displayName ?? item.username ?? item.chatId)}</Text>
              <Text style={[styles.muted, { color: colors.muted }]}>Destination ID: {shortId(item.destinationId ?? item.id)}</Text>
              <Text style={[styles.muted, { color: colors.muted }]}>Chat ID: {displayValue(item.chatId)}</Text>
              <Text style={[styles.muted, { color: colors.muted }]}>Username: {displayValue(item.username)}</Text>
              <View style={styles.row}>
                <Badge label={item.chatType} tone="info" />
                <Badge label={activeLabel(item)} tone={active ? "success" : "neutral"} />
              </View>
            </Card>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.table, { borderColor: colors.border }]}> 
      <View style={[styles.tableRow, styles.header, { backgroundColor: colors.surfaceAlt, borderBottomColor: colors.border }]}> 
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Destination ID</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Chat ID</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.9 }]}>Username</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.2 }]}>Title</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.9 }]}>Type</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.9 }]}>Status</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1 }]}>Updated</Text>
      </View>
      {items.map((item, index) => {
        const active = item.active ?? item.enabled;
        return (
          <View key={item.id ?? item.destinationId ?? item.chatId ?? String(index)} style={[styles.tableRow, { borderBottomColor: colors.border }]}> 
            <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1.1 }]}>{shortId(item.destinationId ?? item.id)}</Text>
            <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1.1 }]}>{displayValue(item.chatId)}</Text>
            <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 0.9 }]}>{displayValue(item.username)}</Text>
            <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1.2 }]}>{displayValue(item.title ?? item.displayName)}</Text>
            <View style={{ flex: 0.9 }}><Badge label={item.chatType} tone="info" /></View>
            <View style={{ flex: 0.9 }}><Badge label={activeLabel(item)} tone={active ? "success" : "neutral"} /></View>
            <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1 }]}>{formatDateTime(item.updatedAt ?? item.createdAt)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.md },
  card: { gap: spacing.sm },
  title: { fontSize: 16, fontWeight: "900" },
  muted: { fontSize: 13 },
  row: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  table: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  tableRow: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1 },
  header: { minHeight: 48 },
  th: { fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  td: { fontSize: 13 },
  tdStrong: { fontSize: 13, fontWeight: "800" }
});
