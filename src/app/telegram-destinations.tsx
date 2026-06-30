import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { telegramDestinationApi } from "@/api/telegramDestinationApi";
import { TelegramDestinationForm } from "@/components/telegram/TelegramDestinationForm";
import { TelegramDestinationList } from "@/components/telegram/TelegramDestinationList";
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
import { CreateTelegramDestinationRequest, TelegramChatType, TelegramDestination } from "@/types/telegramDestination";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";

const chatTypeOptions: { label: string; value: TelegramChatType | "ALL" }[] = [
  { label: "All chat types", value: "ALL" },
  { label: "PRIVATE", value: "PRIVATE" },
  { label: "GROUP", value: "GROUP" },
  { label: "SUPERGROUP", value: "SUPERGROUP" },
  { label: "CHANNEL", value: "CHANNEL" }
];

const sortDirOptions: { label: string; value: SortDir }[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" }
];

export default function TelegramDestinationsPage() {
  const colors = useThemeColors();
  const { showToast } = useToast();
  const [destinationId, setDestinationId] = useState("");
  const [enabledResult, setEnabledResult] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [chatType, setChatType] = useState<TelegramChatType | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    chatType: chatType === "ALL" ? undefined : chatType,
    page,
    size,
    sortBy: "createdAt",
    sortDir
  }), [chatType, debouncedSearch, page, size, sortDir]);
  const queryKey = useMemo(() => JSON.stringify(params), [params]);
  const fetchDestinations = useCallback(() => telegramDestinationApi.list(params), [params]);
  const { data, loading, error, retry } = usePaginatedQuery<TelegramDestination>(queryKey, params, fetchDestinations);

  const create = async (values: CreateTelegramDestinationRequest) => {
    setLoadingCreate(true);
    try {
      await telegramDestinationApi.create(values);
      showToast("success", "Telegram destination created successfully");
      setPage(0);
      void retry();
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to create Telegram destination");
    } finally {
      setLoadingCreate(false);
    }
  };

  const checkEnabled = async () => {
    if (!destinationId.trim()) {
      showToast("error", "Enter Destination ID first");
      return;
    }
    setLoadingCheck(true);
    try {
      const result = await telegramDestinationApi.getEnabled(destinationId.trim());
      setEnabledResult(typeof result === "boolean" ? result : Boolean(result.active ?? result.enabled));
      showToast("success", "Destination enabled status loaded");
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to check destination");
    } finally {
      setLoadingCheck(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setChatType("ALL");
    setPage(0);
    setSize(20);
    setSortDir("desc");
  };

  return (
    <View style={styles.page}>
      <PageHeader
        title="Telegram Destinations"
        description="Search Telegram destinations by destination ID or username, filter by chat type, and load every page from backend pagination."
      />

      <View style={styles.twoColumns}>
        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Create Telegram destination</Text>
          <TelegramDestinationForm loading={loadingCreate} onSubmit={create} />
        </Card>

        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Check enabled destination</Text>
          <Input label="Destination ID" value={destinationId} onChangeText={setDestinationId} helperText="GET /telegram/destinations/{destinationId}/enabled" />
          <Button title="Check enabled" loading={loadingCheck} onPress={checkEnabled} />
          {enabledResult !== null ? (
            <View style={styles.resultRow}>
              <Text style={[styles.helper, { color: colors.textSoft }]}>Destination status:</Text>
              <Badge label={enabledResult ? "ENABLED" : "DISABLED"} tone={enabledResult ? "success" : "neutral"} />
            </View>
          ) : null}
        </Card>
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Destination list</Text>
            <Text style={[styles.helper, { color: colors.muted }]}>GET /telegram/destinations?search=&chatType=&page=&size=&sortBy=createdAt&sortDir=</Text>
          </View>
          <Button title="Reset filters" variant="secondary" onPress={resetFilters} />
        </View>

        <FilterToolbar>
          <View style={styles.filterItem}>
            <Input
              label="Search"
              value={search}
              onChangeText={(value) => { setSearch(value); setPage(0); }}
              placeholder="Destination ID or Telegram username"
            />
          </View>
          <View style={styles.filterItemSmall}>
            <Select<TelegramChatType | "ALL"> label="Chat Type" value={chatType} options={chatTypeOptions} onChange={(value) => { setChatType(value); setPage(0); }} />
          </View>
          <View style={styles.filterItemSmall}>
            <Select<SortDir> label="Sort" value={sortDir} options={sortDirOptions} onChange={(value) => { setSortDir(value); setPage(0); }} />
          </View>
        </FilterToolbar>

        {loading && data.items.length === 0 ? <LoadingState label="Loading Telegram destinations..." /> : null}
        {error ? <ErrorState message={error.message} onRetry={retry} /> : null}
        {!loading || data.items.length > 0 ? <TelegramDestinationList items={data.items} /> : null}
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
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap", marginBottom: spacing.lg },
  helper: { fontSize: 14, lineHeight: 21 },
  resultRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
  filterItem: { minWidth: 260, flex: 1 },
  filterItemSmall: { minWidth: 180 }
});
