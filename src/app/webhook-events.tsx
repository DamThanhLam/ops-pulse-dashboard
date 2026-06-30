import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { webhookEventApi } from "@/api/webhookEventApi";
import { GithubWebhookTesterForm } from "@/components/webhook-events/GithubWebhookTesterForm";
import { WebhookEventForm } from "@/components/webhook-events/WebhookEventForm";
import { WebhookEventList } from "@/components/webhook-events/WebhookEventList";
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
import { CreateWebhookEventRequest, GithubWebhookHeaders, WebhookEvent } from "@/types/webhookEvent";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

const sortDirOptions: { label: string; value: SortDir }[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" }
];

export default function WebhookEventsPage() {
  const colors = useThemeColors();
  const { showToast } = useToast();
  const [deliveryId, setDeliveryId] = useState("");
  const [existsResult, setExistsResult] = useState<boolean | null>(null);
  const [lookupItems, setLookupItems] = useState<WebhookEvent[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [loadingTester, setLoadingTester] = useState(false);

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    page,
    size,
    sortBy: "createdAt",
    sortDir
  }), [debouncedSearch, page, size, sortDir]);
  const queryKey = useMemo(() => JSON.stringify(params), [params]);
  const fetchEvents = useCallback(() => webhookEventApi.list(params), [params]);
  const { data, loading, error, retry } = usePaginatedQuery<WebhookEvent>(queryKey, params, fetchEvents);

  const create = async (values: CreateWebhookEventRequest) => {
    setLoadingCreate(true);
    try {
      await webhookEventApi.create(values);
      showToast("success", "Webhook event created successfully");
      setPage(0);
      void retry();
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to create webhook event");
    } finally {
      setLoadingCreate(false);
    }
  };

  const getByDeliveryId = async () => {
    if (!deliveryId.trim()) {
      showToast("error", "Enter Delivery ID first");
      return;
    }
    setLoadingLookup(true);
    try {
      const event = await webhookEventApi.getByDeliveryId(deliveryId.trim());
      setLookupItems([event]);
      setExistsResult(null);
      showToast("success", "Webhook event loaded");
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to load webhook event");
    } finally {
      setLoadingLookup(false);
    }
  };

  const checkExists = async () => {
    if (!deliveryId.trim()) {
      showToast("error", "Enter Delivery ID first");
      return;
    }
    setLoadingLookup(true);
    try {
      const exists = await webhookEventApi.exists(deliveryId.trim());
      setExistsResult(exists);
      showToast("success", "Webhook exists check completed");
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to check webhook event");
    } finally {
      setLoadingLookup(false);
    }
  };

  const sendTestWebhook = async (headers: GithubWebhookHeaders, rawPayload: string) => {
    setLoadingTester(true);
    try {
      await webhookEventApi.testGithubWebhook(headers, rawPayload);
      showToast("success", "GitHub webhook test sent successfully");
      setPage(0);
      void retry();
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to send test webhook");
    } finally {
      setLoadingTester(false);
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
        title="Webhook Events"
        description="Inspect GitHub webhook event intake with paginated backend search by Telegram destination username or GitHub repository name."
      />

      <View style={styles.twoColumns}>
        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Create webhook event</Text>
          <WebhookEventForm loading={loadingCreate} onSubmit={create} />
        </Card>

        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Lookup webhook event</Text>
          <Input label="Delivery ID" value={deliveryId} onChangeText={setDeliveryId} helperText="GET /webhook-events/{deliveryId} and /exists" />
          <Button title="Find webhook event" loading={loadingLookup} onPress={getByDeliveryId} />
          <Button title="Check exists" variant="secondary" loading={loadingLookup} onPress={checkExists} />
          {existsResult !== null ? (
            <View style={styles.resultRow}>
              <Text style={[styles.helper, { color: colors.textSoft }]}>Exists result:</Text>
              <Badge label={existsResult ? "EXISTS" : "NOT_FOUND"} tone={existsResult ? "success" : "neutral"} />
            </View>
          ) : null}
          {lookupItems.length > 0 ? <WebhookEventList items={lookupItems} /> : null}
        </Card>
      </View>

      <Card style={styles.columnCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>GitHub Webhook Tester</Text>
        <Text style={[styles.helper, { color: colors.muted }]}>This sends POST /webhooks/github with GitHub-like headers and a raw JSON body. It is for manual local testing only.</Text>
        <GithubWebhookTesterForm loading={loadingTester} onSubmit={sendTestWebhook} />
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Webhook event list</Text>
            <Text style={[styles.helper, { color: colors.muted }]}>GET /webhook-events?search=&page=&size=&sortBy=createdAt&sortDir=</Text>
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

        {loading && data.items.length === 0 ? <LoadingState label="Loading webhook events..." /> : null}
        {error ? <ErrorState message={error.message} onRetry={retry} /> : null}
        {!loading || data.items.length > 0 ? <WebhookEventList items={data.items} /> : null}
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
