import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { GithubRepository } from "@/types/githubRepository";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";
import { displayValue, formatDateTime, shortId } from "@/utils/format";

type RepositoryListProps = {
  items: GithubRepository[];
  onSelect?: (item: GithubRepository) => void;
};

function systemId(item: GithubRepository) {
  return item.id ?? item.repositoryId ?? item.systemRepositoryId;
}

function githubId(item: GithubRepository) {
  return item.githubRepoId ?? item.githubRepositoryId;
}

function owner(item: GithubRepository) {
  return item.ownerName ?? item.owner;
}

function name(item: GithubRepository) {
  return item.repoName ?? item.name;
}

function fullName(item: GithubRepository) {
  return item.fullName ?? ([owner(item), name(item)].filter(Boolean).join("/") || undefined);
}

function activeLabel(item: GithubRepository) {
  const active = item.active ?? item.enabled;
  if (typeof active === "boolean") return active ? "ACTIVE" : "INACTIVE";
  return item.status ?? "UNKNOWN";
}

export function RepositoryList({ items, onSelect }: RepositoryListProps) {
  const { width } = useWindowDimensions();
  const colors = useThemeColors();
  const desktop = width >= 900;

  if (items.length === 0) {
    return <EmptyState title="No repositories found" description="No repository matched the current page or filters." />;
  }

  if (!desktop) {
    return (
      <View style={styles.stack}>
        {items.map((item, index) => {
          const active = item.active ?? item.enabled;
          return (
            <Pressable key={String(systemId(item) ?? githubId(item) ?? index)} onPress={() => onSelect?.(item)}>
              <Card style={styles.mobileCard}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{displayValue(fullName(item))}</Text>
                <Text style={[styles.muted, { color: colors.muted }]}>System ID: {shortId(systemId(item))}</Text>
                <Text style={[styles.muted, { color: colors.muted }]}>GitHub ID: {shortId(githubId(item))}</Text>
                <Text style={[styles.muted, { color: colors.muted }]}>Owner: {displayValue(owner(item))}</Text>
                <View style={styles.rowBetween}>
                  <Text style={[styles.muted, { color: colors.muted }]}>Updated: {formatDateTime(item.updatedAt)}</Text>
                  <Badge label={activeLabel(item)} tone={active ? "success" : "neutral"} />
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.table, { borderColor: colors.border }]}> 
      <View style={[styles.tableRow, styles.header, { backgroundColor: colors.surfaceAlt, borderBottomColor: colors.border }]}> 
        <Text style={[styles.th, { color: colors.muted, flex: 1.1 }]}>System ID</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1 }]}>GitHub ID</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1.4 }]}>Full name</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.9 }]}>Owner</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 0.9 }]}>Status</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1 }]}>Created</Text>
        <Text style={[styles.th, { color: colors.muted, flex: 1 }]}>Updated</Text>
      </View>
      {items.map((item, index) => {
        const active = item.active ?? item.enabled;
        return (
          <Pressable key={String(systemId(item) ?? githubId(item) ?? index)} onPress={() => onSelect?.(item)} style={({ pressed }) => [{ opacity: pressed ? 0.72 : 1 }]}> 
            <View style={[styles.tableRow, { borderBottomColor: colors.border }]}> 
              <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1.1 }]}>{shortId(systemId(item))}</Text>
              <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1 }]}>{shortId(githubId(item))}</Text>
              <Text numberOfLines={1} style={[styles.tdStrong, { color: colors.text, flex: 1.4 }]}>{displayValue(fullName(item))}</Text>
              <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 0.9 }]}>{displayValue(owner(item))}</Text>
              <View style={{ flex: 0.9 }}><Badge label={activeLabel(item)} tone={active ? "success" : "neutral"} /></View>
              <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1 }]}>{formatDateTime(item.createdAt)}</Text>
              <Text numberOfLines={1} style={[styles.td, { color: colors.textSoft, flex: 1 }]}>{formatDateTime(item.updatedAt)}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.md },
  mobileCard: { gap: spacing.sm },
  cardTitle: { fontSize: 16, fontWeight: "900" },
  muted: { fontSize: 13 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap" },
  table: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  tableRow: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1 },
  header: { minHeight: 48 },
  th: { fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  td: { fontSize: 13 },
  tdStrong: { fontSize: 13, fontWeight: "800" }
});
