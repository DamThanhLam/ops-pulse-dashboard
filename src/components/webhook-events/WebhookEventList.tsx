import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { WebhookEvent } from "@/types/webhookEvent";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";
import { displayValue, formatDateTime, shortId } from "@/utils/format";

type Props = { items: WebhookEvent[] };

function repoName(item: WebhookEvent) {
  return item.githubRepositoryName ?? item.githubRepoName ?? item.repositoryName;
}

function destinationUsername(item: WebhookEvent) {
  return item.destinationUsername ?? item.telegramDestinationUsername ?? item.telegramUsername;
}

function eventStatus(item: WebhookEvent) {
  return item.processingStatus ?? item.status ?? item.result ?? "RECEIVED";
}

export function WebhookEventList({ items }: Props) {
  const { width } = useWindowDimensions();
  const colors = useThemeColors();
  const desktop = width >= 940;

  if (items.length === 0) {
    return <EmptyState title="No webhook events" description="No webhook event matched the current search." />;
  }

  if (!desktop) {
    return (
      <View style={styles.stack}>
        {items.map((item, index) => (
          <Card key={item.id ?? item.webhookEventId ?? item.deliveryId ?? String(index)} style={styles.card}>
            <Text style={[styles.title, { color: colors.text }]}>{displayValue(item.webhookEventId ?? item.id)}</Text>
            <Text style={[styles.muted, { color: colors.muted }]}>Repo: {displayValue(repoName(item) ?? item.githubRepoId ?? item.githubRepositoryId)}</Text>
            <Text style={[styles.muted, { color: colors.muted }]}>Destination: {displayValue(destinationUsername(item))}</Text>
            <Text style={[styles.muted, { color: colors.muted }]}>Delivery: {shortId(item.deliveryId)}</Text>
            <View style={styles.row}>
              <Badge label={item.eventType} tone="info" />
              <Badge label={eventStatus(item)} tone={statusTone(eventStatus(item))} />
            </View>
            <Text style={[styles.muted, { color: colors.muted }]}>Received: {formatDateTime(item.receivedAt ?? item.createdAt)}</Text>
          </Card>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.table, { borderColor: colors.border }]}> 
      <View style={[styles.tableRow, styles.header, { backgroundColor: colors.surfaceAlt, borderBottomColor: colors.border }]}> 
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Webhook ID</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Repository</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.8 }]}>Route</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.8 }]}>Delivery</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Destination</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.8 }]}>Event</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.9 }]}>Status</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1 }]}>Received</Text>
      </View>
      {items.map((item, index) => (
        <View key={item.id ?? item.webhookEventId ?? item.deliveryId ?? String(index)} style={[styles.tableRow, { borderBottomColor: colors.border }]}> 
          <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1.1 }]}>{shortId(item.webhookEventId ?? item.id)}</Text>
          <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1.1 }]}>{displayValue(repoName(item) ?? item.githubRepoId ?? item.githubRepositoryId)}</Text>
          <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 0.8 }]}>{shortId(item.routeId)}</Text>
          <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 0.8 }]}>{shortId(item.deliveryId)}</Text>
          <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1.1 }]}>{displayValue(destinationUsername(item))}</Text>
          <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 0.8 }]}>{displayValue(item.eventType)}</Text>
          <View style={{ flex: 0.9 }}><Badge label={eventStatus(item)} tone={statusTone(eventStatus(item))} /></View>
          <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1 }]}>{formatDateTime(item.receivedAt ?? item.createdAt ?? item.updatedAt)}</Text>
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
  row: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  table: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  tableRow: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1 },
  header: { minHeight: 48 },
  th: { fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  td: { fontSize: 13 },
  tdStrong: { fontSize: 13, fontWeight: "800" }
});
