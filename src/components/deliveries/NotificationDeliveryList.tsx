import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotificationDelivery } from "@/types/notificationDelivery";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";
import { displayValue, formatDateTime, shortId } from "@/utils/format";

type Props = { items: NotificationDelivery[] };

function repoName(item: NotificationDelivery) {
  return item.githubRepositoryName ?? item.githubRepoName ?? item.repositoryName;
}

function destinationUsername(item: NotificationDelivery) {
  return item.destinationUsername ?? item.telegramDestinationUsername ?? item.telegramUsername;
}

function attempts(item: NotificationDelivery) {
  return item.retryCount ?? item.attemptCount ?? 0;
}

export function NotificationDeliveryList({ items }: Props) {
  const { width } = useWindowDimensions();
  const colors = useThemeColors();
  const desktop = width >= 940;

  if (items.length === 0) {
    return <EmptyState title="No deliveries found" description="No delivery matched the current filters." />;
  }

  if (!desktop) {
    return (
      <View style={styles.stack}>
        {items.map((item, index) => (
          <Card key={item.id ?? item.deliveryId ?? `${item.destinationId}-${index}`} style={styles.card}>
            <Text style={[styles.title, { color: colors.text }]}>{displayValue(item.deliveryId ?? item.id)}</Text>
            <Text style={[styles.muted, { color: colors.muted }]}>Repo: {displayValue(repoName(item))}</Text>
            <Text style={[styles.muted, { color: colors.muted }]}>Destination: {displayValue(destinationUsername(item) ?? item.destinationId)}</Text>
            <Text numberOfLines={3} style={[styles.message, { color: colors.textSoft }]}>{displayValue(item.errorMessage ?? item.messageText)}</Text>
            <View style={styles.row}>
              <Badge label={item.status ?? "PENDING"} tone={statusTone(item.status)} />
              <Badge label={item.eventType ?? "EVENT"} tone="info" />
              <Badge label={`Retry ${attempts(item)}`} tone="neutral" />
            </View>
          </Card>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.table, { borderColor: colors.border }]}> 
      <View style={[styles.tableRow, styles.header, { backgroundColor: colors.surfaceAlt, borderBottomColor: colors.border }]}> 
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Delivery ID</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.8 }]}>Status</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Repository</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Destination</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.8 }]}>Route</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.8 }]}>Event</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.7 }]}>Retry</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Error / Sent</Text>
      </View>
      {items.map((item, index) => (
        <View key={item.id ?? item.deliveryId ?? `${item.destinationId}-${index}`} style={[styles.tableRow, { borderBottomColor: colors.border }]}> 
          <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1.1 }]}>{shortId(item.deliveryId ?? item.id)}</Text>
          <View style={{ flex: 0.8 }}><Badge label={item.status ?? "PENDING"} tone={statusTone(item.status)} /></View>
          <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1.1 }]}>{displayValue(repoName(item))}</Text>
          <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1.1 }]}>{displayValue(destinationUsername(item) ?? item.destinationId)}</Text>
          <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 0.8 }]}>{shortId(item.routeId)}</Text>
          <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 0.8 }]}>{displayValue(item.eventType)}</Text>
          <Text style={[styles.td, { color: colors.textSoft, flex: 0.7 }]}>{attempts(item)}</Text>
          <Text numberOfLines={2} style={[styles.td, { color: item.errorMessage ? colors.error : colors.textSoft, flex: 1.1 }]}>{item.errorMessage ?? formatDateTime(item.deliveredAt ?? item.sentAt ?? item.updatedAt ?? item.createdAt)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.md },
  card: { gap: spacing.sm },
  title: { fontSize: 16, fontWeight: "900" },
  muted: { fontSize: 13 },
  message: { fontSize: 14, lineHeight: 20 },
  row: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  table: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  tableRow: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1 },
  header: { minHeight: 48 },
  th: { fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  td: { fontSize: 13 },
  tdStrong: { fontSize: 13, fontWeight: "800" }
});
