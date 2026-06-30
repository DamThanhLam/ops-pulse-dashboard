import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { notificationDeliveryApi } from "@/api/notificationDeliveryApi";
import { NotificationDeliveryForm } from "@/components/deliveries/NotificationDeliveryForm";
import { NotificationDeliveryList } from "@/components/deliveries/NotificationDeliveryList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { FilterToolbar } from "@/components/ui/FilterToolbar";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { Select } from "@/components/ui/Select";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useToast } from "@/hooks/useToast";
import { SortDir } from "@/types/api";
import { CreateNotificationDeliveryRequest, DELIVERY_STATUS_OPTIONS, NotificationDelivery, NotificationDeliveryStatus } from "@/types/notificationDelivery";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

const statusOptions = DELIVERY_STATUS_OPTIONS.map((value) => ({ label: value, value }));
const sortDirOptions: { label: string; value: SortDir }[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" }
];

export default function NotificationDeliveriesPage() {
  const colors = useThemeColors();
  const { showToast } = useToast();
  const [status, setStatus] = useState<NotificationDeliveryStatus>("PENDING");
  const [destinationUsername, setDestinationUsername] = useState("");
  const [githubRepoName, setGithubRepoName] = useState("");
  const debouncedDestinationUsername = useDebouncedValue(destinationUsername.trim(), 350);
  const debouncedGithubRepoName = useDebouncedValue(githubRepoName.trim(), 350);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [now, setNow] = useState(new Date().toISOString());
  const [retryableItems, setRetryableItems] = useState<NotificationDelivery[]>([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingRetryable, setLoadingRetryable] = useState(false);

  const params = useMemo(() => ({
    status,
    destinationUsername: debouncedDestinationUsername || undefined,
    githubRepoName: debouncedGithubRepoName || undefined,
    page,
    size,
    sortBy: "createdAt",
    sortDir
  }), [debouncedDestinationUsername, debouncedGithubRepoName, page, size, sortDir, status]);
  const queryKey = useMemo(() => JSON.stringify(params), [params]);
  const fetchDeliveries = useCallback(() => notificationDeliveryApi.list(params), [params]);
  const { data, loading, error, retry } = usePaginatedQuery<NotificationDelivery>(queryKey, params, fetchDeliveries);

  const create = async (values: CreateNotificationDeliveryRequest) => {
    setLoadingCreate(true);
    try {
      await notificationDeliveryApi.create(values);
      showToast("success", "Notification delivery created successfully");
      setPage(0);
      void retry();
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to create delivery");
    } finally {
      setLoadingCreate(false);
    }
  };

  const filterRetryable = async () => {
    setLoadingRetryable(true);
    try {
      const deliveries = await notificationDeliveryApi.getRetryable(status, now);
      setRetryableItems(deliveries);
      showToast("success", "Retryable deliveries loaded");
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to filter retryable deliveries");
    } finally {
      setLoadingRetryable(false);
    }
  };

  const resetFilters = () => {
    setStatus("PENDING");
    setDestinationUsername("");
    setGithubRepoName("");
    setPage(0);
    setSize(20);
    setSortDir("desc");
  };

  return (
    <View style={styles.page}>
      <PageHeader
        title="Notification Deliveries"
        description="Review delivery attempts with PENDING as the default status, plus backend-side filters for destination username and GitHub repository name."
      />

      <View style={styles.twoColumns}>
        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Create notification delivery</Text>
          <NotificationDeliveryForm loading={loadingCreate} onSubmit={create} />
        </Card>

        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Retryable delivery diagnostics</Text>
          <Input label="Now Instant" value={now} onChangeText={setNow} helperText="Used by GET /notification/deliveries/retryable?status={status}&now={instant}" />
          <Button title="Filter retryable" variant="secondary" loading={loadingRetryable} onPress={filterRetryable} />
          {retryableItems.length > 0 ? <NotificationDeliveryList items={retryableItems} /> : <Text style={[styles.helper, { color: colors.muted }]}>Optional manual diagnostic lookup. Main list below uses the new paginated API.</Text>}
        </Card>
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery list</Text>
            <Text style={[styles.helper, { color: colors.muted }]}>GET /notification-deliveries?status={status}&destinationUsername=&githubRepoName=&page=&size=&sortBy=createdAt&sortDir=</Text>
          </View>
          <Button title="Reset filters" variant="secondary" onPress={resetFilters} />
        </View>

        <FilterToolbar>
          <View style={styles.filterItemSmall}>
            <Select<NotificationDeliveryStatus> label="Status" value={status} onChange={(value) => { setStatus(value); setPage(0); }} options={statusOptions} />
          </View>
          <View style={styles.filterItem}>
            <Input
              label="Destination username"
              value={destinationUsername}
              onChangeText={(value) => { setDestinationUsername(value); setPage(0); }}
              placeholder="telegram_user_or_channel"
            />
          </View>
          <View style={styles.filterItem}>
            <Input
              label="GitHub repo name"
              value={githubRepoName}
              onChangeText={(value) => { setGithubRepoName(value); setPage(0); }}
              placeholder="owner/repo or repo"
            />
          </View>
          <View style={styles.filterItemSmall}>
            <Select<SortDir> label="Sort" value={sortDir} options={sortDirOptions} onChange={(value) => { setSortDir(value); setPage(0); }} />
          </View>
        </FilterToolbar>

        {loading && data.items.length === 0 ? <LoadingState label="Loading notification deliveries..." /> : null}
        {error ? <ErrorState message={error.message} onRetry={retry} /> : null}
        {!loading || data.items.length > 0 ? <NotificationDeliveryList items={data.items} /> : null}
        <PaginationControls page={data} pageSize={size} loading={loading} onPageChange={setPage} onPageSizeChange={(value) => { setSize(value); setPage(0); }} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl },
  twoColumns: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xl },
  columnCard: { flex: 1, minWidth: 320, gap: spacing.lg },
  sectionTitle: { fontSize: 20, fontWeight: "900" },
  helper: { fontSize: 14, lineHeight: 21 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap", marginBottom: spacing.lg },
  filterItem: { minWidth: 240, flex: 1 },
  filterItemSmall: { minWidth: 180 }
});
