import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotificationRoute } from "@/types/notificationRoute";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";
import { displayValue, formatDateTime, shortId } from "@/utils/format";

type Props = { items: NotificationRoute[] };

function repoName(item: NotificationRoute) {
  return item.githubRepositoryFullName ?? item.githubRepoFullName ?? item.repositoryFullName ?? item.githubRepositoryName ?? item.githubRepoName ?? item.repositoryName;
}

function destinationUsername(item: NotificationRoute) {
  return item.destinationUsername ?? item.telegramDestinationUsername ?? item.telegramUsername;
}

function activeLabel(item: NotificationRoute) {
  const active = item.active ?? item.enabled;
  if (typeof active === "boolean") return active ? "ACTIVE" : "INACTIVE";
  return item.status ?? "UNKNOWN";
}

export function NotificationRouteList({ items }: Props) {
  const { width } = useWindowDimensions();
  const colors = useThemeColors();
  const desktop = width >= 940;

  if (items.length === 0) {
    return <EmptyState title="No notification routes" description="No route matched the current search." />;
  }

  if (!desktop) {
    return (
      <View style={styles.stack}>
        {items.map((item, index) => {
          const active = item.active ?? item.enabled;
          return (
            <Card key={item.id ?? item.routeId ?? `${item.destinationId}-${index}`} style={styles.card}>
              <Text style={[styles.title, { color: colors.text }]}>{displayValue(repoName(item), "Global repository route")}</Text>
              <Text style={[styles.muted, { color: colors.muted }]}>Route ID: {shortId(item.routeId ?? item.id)}</Text>
              <Text style={[styles.muted, { color: colors.muted }]}>GitHub Repo ID: {shortId(item.githubRepoId ?? item.githubRepositoryId ?? item.repositoryId)}</Text>
              <Text style={[styles.muted, { color: colors.muted }]}>Destination: {displayValue(destinationUsername(item) ?? item.destinationId)}</Text>
              <View style={styles.row}>
                <Badge label={item.telegramChatType ?? item.chatType ?? "CHAT"} tone="info" />
                <Badge label={item.eventType ?? "ALL_EVENTS"} tone="info" />
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
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Route ID</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.2 }]}>GitHub Repo</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.4 }]}>Repository name</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>Destination</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.8 }]}>Chat type</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.8 }]}>Event</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.8 }]}>Status</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1 }]}>Updated</Text>
      </View>
      {items.map((item, index) => {
        const active = item.active ?? item.enabled;
        return (
          <View key={item.id ?? item.routeId ?? `${item.destinationId}-${index}`} style={[styles.tableRow, { borderBottomColor: colors.border }]}> 
            <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1.1 }]}>{shortId(item.routeId ?? item.id)}</Text>
            <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1.2 }]}>{shortId(item.githubRepoId ?? item.githubRepositoryId ?? item.repositoryId)}</Text>
            <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1.4 }]}>{displayValue(repoName(item), "Global")}</Text>
            <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1.1 }]}>{displayValue(destinationUsername(item) ?? item.destinationId)}</Text>
            <View style={{ flex: 0.8 }}><Badge label={item.telegramChatType ?? item.chatType ?? "-"} tone="info" /></View>
            <View style={{ flex: 0.8 }}><Badge label={item.eventType ?? "ALL"} tone="info" /></View>
            <View style={{ flex: 0.8 }}><Badge label={activeLabel(item)} tone={active ? "success" : "neutral"} /></View>
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
