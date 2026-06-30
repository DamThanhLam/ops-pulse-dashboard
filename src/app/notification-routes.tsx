import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { notificationRouteApi } from "@/api/notificationRouteApi";
import { NotificationRouteForm } from "@/components/routes/NotificationRouteForm";
import { NotificationRouteList } from "@/components/routes/NotificationRouteList";
import { Badge } from "@/components/ui/Badge";
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
import { CreateNotificationRouteRequest, EVENT_TYPE_OPTIONS, NotificationRoute } from "@/types/notificationRoute";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

const eventOptions = EVENT_TYPE_OPTIONS.map((value) => ({ label: value, value }));
type EventOption = typeof EVENT_TYPE_OPTIONS[number];

const sortDirOptions: { label: string; value: SortDir }[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" }
];

export default function NotificationRoutesPage() {
  const colors = useThemeColors();
  const { showToast } = useToast();
  const [repositoryId, setRepositoryId] = useState("");
  const [githubRepoId, setGithubRepoId] = useState("");
  const [eventType, setEventType] = useState<EventOption>("push");
  const [enabledResult, setEnabledResult] = useState<boolean | null>(null);
  const [lookupItems, setLookupItems] = useState<NotificationRoute[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingLookup, setLoadingLookup] = useState(false);

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    page,
    size,
    sortBy: "createdAt",
    sortDir
  }), [debouncedSearch, page, size, sortDir]);
  const queryKey = useMemo(() => JSON.stringify(params), [params]);
  const fetchRoutes = useCallback(() => notificationRouteApi.list(params), [params]);
  const { data, loading, error, retry } = usePaginatedQuery<NotificationRoute>(queryKey, params, fetchRoutes);

  const create = async (values: CreateNotificationRouteRequest) => {
    setLoadingCreate(true);
    try {
      await notificationRouteApi.create(values);
      showToast("success", "Notification route created successfully");
      setPage(0);
      void retry();
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to create route");
    } finally {
      setLoadingCreate(false);
    }
  };

  const lookupActive = async () => {
    if (!repositoryId.trim()) {
      showToast("error", "Enter Repository ID first");
      return;
    }
    setLoadingLookup(true);
    try {
      const routes = await notificationRouteApi.getActive(repositoryId.trim(), eventType);
      setLookupItems(routes);
      setEnabledResult(null);
      showToast("success", "Active routes loaded");
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to load active routes");
    } finally {
      setLoadingLookup(false);
    }
  };

  const lookupActiveByEvent = async () => {
    setLoadingLookup(true);
    try {
      const routes = await notificationRouteApi.getActiveByEvent(eventType);
      setLookupItems(routes);
      setEnabledResult(null);
      showToast("success", "Active routes by event loaded");
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to load routes by event");
    } finally {
      setLoadingLookup(false);
    }
  };

  const lookupEnabled = async () => {
    if (!githubRepoId.trim()) {
      showToast("error", "Enter GitHub Repo ID first");
      return;
    }
    setLoadingLookup(true);
    try {
      const result = await notificationRouteApi.getEnabled(githubRepoId.trim(), eventType);
      if (typeof result === "boolean") {
        setEnabledResult(result);
        setLookupItems([]);
      } else {
        setEnabledResult(Boolean(result.active ?? result.enabled));
        setLookupItems([result]);
      }
      showToast("success", "Enabled route lookup completed");
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to check enabled route");
    } finally {
      setLoadingLookup(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setPage(0);
    setSize(20);
    setSortDir("desc");
  };

  return (
    <View style={styles.page}>
      <PageHeader
        title="Notification Routes"
        description="Load notification routes from the backend with paginated search by Telegram destination username or GitHub repository name."
      />

      <View style={styles.twoColumns}>
        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Create notification route</Text>
          <NotificationRouteForm loading={loadingCreate} onSubmit={create} />
        </Card>

        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Route diagnostics</Text>
          <Select<EventOption> label="Event Type" value={eventType} onChange={setEventType} options={eventOptions} />
          <Input label="Repository ID" value={repositoryId} onChangeText={setRepositoryId} helperText="GET /notification/routes/active?repositoryId={uuid}&eventType={eventType}" />
          <Button title="Find active by repository" loading={loadingLookup} onPress={lookupActive} />
          <Button title="Find active by event" variant="secondary" loading={loadingLookup} onPress={lookupActiveByEvent} />
          <Input label="GitHub Repo ID" value={githubRepoId} onChangeText={setGithubRepoId} helperText="GET /notification/routes/enabled?githubRepoId={id}&eventType={eventType}" />
          <Button title="Check enabled route" variant="secondary" loading={loadingLookup} onPress={lookupEnabled} />
          {enabledResult !== null ? (
            <View style={styles.resultRow}>
              <Text style={[styles.helper, { color: colors.textSoft }]}>Enabled lookup:</Text>
              <Badge label={enabledResult ? "ENABLED" : "DISABLED"} tone={enabledResult ? "success" : "neutral"} />
            </View>
          ) : null}
          {lookupItems.length > 0 ? <NotificationRouteList items={lookupItems} /> : null}
        </Card>
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Route list</Text>
            <Text style={[styles.helper, { color: colors.muted }]}>GET /notification-routes?search=&page=&size=&sortBy=createdAt&sortDir=</Text>
          </View>
          <Button title="Reset filters" variant="secondary" onPress={resetFilters} />
        </View>

        <FilterToolbar>
          <View style={styles.filterItem}>
            <Input
              label="Search"
              value={search}
              onChangeText={(value) => { setSearch(value); setPage(0); }}
              placeholder="Destination username or GitHub repo name"
            />
          </View>
          <View style={styles.filterItemSmall}>
            <Select<SortDir> label="Sort" value={sortDir} options={sortDirOptions} onChange={(value) => { setSortDir(value); setPage(0); }} />
          </View>
        </FilterToolbar>

        {loading && data.items.length === 0 ? <LoadingState label="Loading notification routes..." /> : null}
        {error ? <ErrorState message={error.message} onRetry={retry} /> : null}
        {!loading || data.items.length > 0 ? <NotificationRouteList items={data.items} /> : null}
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
  resultRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap", marginBottom: spacing.lg },
  filterItem: { minWidth: 260, flex: 1 },
  filterItemSmall: { minWidth: 180 }
});
