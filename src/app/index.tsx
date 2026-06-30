import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

const stats = [
  { label: "GitHub Repositories", value: "Paged", note: "GET /github/repositories" },
  { label: "Telegram Destinations", value: "Paged", note: "Search by ID or username" },
  { label: "Notification Routes", value: "Paged", note: "Search by destination or repository" },
  { label: "Pending Deliveries", value: "Default", note: "First request includes status=PENDING" },
  { label: "Webhook Events", value: "Paged", note: "Search by destination or repository" }
];

export default function DashboardPage() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const columns = width >= 1100 ? 3 : width >= 720 ? 2 : 1;

  return (
    <View style={styles.page}>
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Badge label="Enterprise SaaS Console" tone="info" />
          <Text style={[styles.title, { color: colors.text }]}>Operate GitHub-to-Telegram notifications with confidence.</Text>
          <Text style={[styles.description, { color: colors.textSoft }]}>Manage repositories, Telegram destinations, routes, deliveries, webhook events and test GitHub webhook payloads from one responsive control center.</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((item) => (
          <Card key={item.label} style={[styles.statCard, { width: columns === 1 ? "100%" : columns === 2 ? "48%" : "31%" }]}> 
            <Text style={[styles.statLabel, { color: colors.muted }]}>{item.label}</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{item.value}</Text>
            <Text style={[styles.statNote, { color: colors.textSoft }]}>{item.note}</Text>
          </Card>
        ))}
      </View>

      <Card style={styles.noteCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Backend pagination enabled</Text>
        <Text style={[styles.description, { color: colors.textSoft }]}>Listing pages now request backend paginated APIs with page, size, sortBy and sortDir controls. Search and filter state is preserved while paging and reset actions restore safe defaults.</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl },
  hero: { flexDirection: "row", gap: spacing.xl, alignItems: "center" },
  heroText: { gap: spacing.md, flex: 1 },
  title: { fontSize: 32, lineHeight: 40, fontWeight: "900" },
  description: { fontSize: 15, lineHeight: 23 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.lg },
  statCard: { minWidth: 240, gap: spacing.sm },
  statLabel: { fontSize: 13, fontWeight: "800" },
  statValue: { fontSize: 30, fontWeight: "900" },
  statNote: { fontSize: 13, lineHeight: 19 },
  noteCard: { gap: spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: "900" }
});
