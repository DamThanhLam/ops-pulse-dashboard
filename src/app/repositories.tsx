import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { githubRepositoryApi, lookupGitHubRepository } from "@/api/githubRepositoryApi";
import { RepositoryForm } from "@/components/repositories/RepositoryForm";
import { RepositoryList } from "@/components/repositories/RepositoryList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { FilterToolbar } from "@/components/ui/FilterToolbar";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { Select } from "@/components/ui/Select";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useToast } from "@/hooks/useToast";
import { SortDir } from "@/types/api";
import { CreateGithubRepositoryRequest, GithubRepository, GitHubRepositoryLookupResult, UpdateGithubRepositoryRequest } from "@/types/githubRepository";
import { useThemeColors } from "@/theme/useThemeColors";
import { spacing } from "@/theme/spacing";
import { copyText } from "@/utils/clipboard";

const sortDirOptions: { label: string; value: SortDir }[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" }
];

export default function RepositoriesPage() {
  const colors = useThemeColors();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<GithubRepository | null>(null);
  const [githubRepoId, setGithubRepoId] = useState("");
  const [lookupInput, setLookupInput] = useState("");
  const [lookupResult, setLookupResult] = useState<GitHubRepositoryLookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [createInitialValues, setCreateInitialValues] = useState<Partial<GithubRepository> | undefined>();
  const [createFormKey, setCreateFormKey] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingLookup, setLoadingLookup] = useState(false);

  const params = useMemo(() => ({ page, size, sortBy: "createdAt", sortDir }), [page, size, sortDir]);
  const queryKey = useMemo(() => JSON.stringify(params), [params]);
  const fetchRepositories = useCallback(() => githubRepositoryApi.list(params), [params]);
  const { data, loading, error, retry } = usePaginatedQuery<GithubRepository>(queryKey, params, fetchRepositories);

  const resetListControls = () => {
    setPage(0);
    setSize(20);
    setSortDir("desc");
  };

  const create = async (values: CreateGithubRepositoryRequest) => {
    setLoadingCreate(true);
    try {
      await githubRepositoryApi.create(values);
      showToast("success", "Repository created successfully");
      setPage(0);
      void retry();
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to create repository");
    } finally {
      setLoadingCreate(false);
    }
  };

  const search = async () => {
    if (!githubRepoId.trim()) {
      showToast("error", "Enter GitHub Repo ID first");
      return;
    }
    setLoadingSearch(true);
    try {
      const repo = await githubRepositoryApi.get(githubRepoId.trim());
      setSelected(repo);
      showToast("success", "Repository loaded for editing");
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Repository not found");
    } finally {
      setLoadingSearch(false);
    }
  };

  const update = async (values: CreateGithubRepositoryRequest) => {
    const targetId = String(selected?.githubRepoId ?? selected?.githubRepositoryId ?? values.githubRepoId);
    const body: UpdateGithubRepositoryRequest = {
      ownerName: values.ownerName,
      repoName: values.repoName,
      fullName: values.fullName,
      secret: values.secret,
      defaultBranch: values.defaultBranch,
      htmlUrl: values.htmlUrl,
      active: values.active
    };

    setLoadingUpdate(true);
    try {
      const updated = await githubRepositoryApi.update(targetId, body);
      setSelected(updated ?? { ...values, githubRepoId: targetId });
      showToast("success", "Repository updated successfully");
      void retry();
    } catch (caught) {
      showToast("error", caught instanceof Error ? caught.message : "Failed to update repository");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const resolveGitHubId = async () => {
    setLoadingLookup(true);
    setLookupError(null);
    setLookupResult(null);
    try {
      const result = await lookupGitHubRepository(lookupInput);
      setLookupResult(result);
      showToast("success", `Resolved GitHub ID ${result.id}`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Failed to resolve GitHub repository";
      setLookupError(message);
      showToast("error", message);
    } finally {
      setLoadingLookup(false);
    }
  };

  const applyLookupToCreateForm = () => {
    if (!lookupResult) return;
    setCreateInitialValues({
      githubRepoId: lookupResult.id,
      ownerName: lookupResult.owner,
      repoName: lookupResult.name,
      fullName: lookupResult.fullName,
      htmlUrl: lookupResult.htmlUrl,
      active: true
    });
    setCreateFormKey((current) => current + 1);
    showToast("success", "Repository form populated from GitHub lookup");
  };

  const copyResolvedId = async () => {
    if (!lookupResult) return;
    const copied = await copyText(String(lookupResult.id));
    showToast(copied ? "success" : "info", copied ? "GitHub ID copied" : `GitHub ID: ${lookupResult.id}`);
  };

  return (
    <View style={styles.page}>
      <PageHeader
        title="GitHub Repositories"
        description="Manage system GitHub repository records and load the repository list from backend-side pagination."
      />

      <View style={styles.twoColumns}>
        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Create repository</Text>
          <RepositoryForm key={createFormKey} initialValues={createInitialValues} loading={loadingCreate} onSubmit={create} submitLabel="Create repository" />
        </Card>

        <Card style={styles.columnCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Resolve GitHub repository ID</Text>
          <Input
            label="GitHub repository"
            value={lookupInput}
            onChangeText={(value) => {
              setLookupInput(value);
              setLookupError(null);
            }}
            placeholder="facebook/react or https://github.com/facebook/react"
            error={lookupError ?? undefined}
          />
          <Button title="Resolve GitHub ID" loading={loadingLookup} onPress={resolveGitHubId} />
          {lookupResult ? (
            <View style={[styles.lookupResult, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}> 
              <Text style={[styles.resultTitle, { color: colors.text }]}>{lookupResult.fullName}</Text>
              <Text style={[styles.helper, { color: colors.textSoft }]}>GitHub repository ID: {lookupResult.id}</Text>
              <Text style={[styles.helper, { color: colors.textSoft }]}>Owner: {lookupResult.owner} · Private: {lookupResult.private ? "Yes" : "No"}</Text>
              <View style={styles.actionRow}>
                <Button title="Copy ID" variant="secondary" onPress={copyResolvedId} />
                <Button title="Use in create form" onPress={applyLookupToCreateForm} />
              </View>
            </View>
          ) : null}
        </Card>
      </View>

      <Card style={styles.columnCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Find and update repository</Text>
        <FilterToolbar>
          <View style={styles.filterItem}>
            <Input label="GitHub Repo ID" value={githubRepoId} onChangeText={setGithubRepoId} helperText="GET /github/repositories/{githubRepoId}" />
          </View>
          <Button title="Find" loading={loadingSearch} onPress={search} />
        </FilterToolbar>
        {loadingSearch ? <LoadingState label="Searching repository..." /> : null}
        {selected ? (
          <RepositoryForm key={String(selected.githubRepoId ?? selected.githubRepositoryId ?? selected.id)} initialValues={selected} loading={loadingUpdate} onSubmit={update} submitLabel="Update repository" />
        ) : (
          <Text style={[styles.helper, { color: colors.muted }]}>Search an existing repository or select one from the paginated list to edit.</Text>
        )}
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Repository list</Text>
            <Text style={[styles.helper, { color: colors.muted }]}>GET /github/repositories?page={page}&size={size}&sortBy=createdAt&sortDir={sortDir}</Text>
          </View>
          <Button title="Reset controls" variant="secondary" onPress={resetListControls} />
        </View>
        <FilterToolbar>
          <View style={styles.filterItemSmall}>
            <Select<SortDir> label="Sort" value={sortDir} options={sortDirOptions} onChange={(value) => { setSortDir(value); setPage(0); }} />
          </View>
        </FilterToolbar>
        {loading && data.items.length === 0 ? <LoadingState label="Loading repositories..." /> : null}
        {error ? <ErrorState message={error.message} onRetry={retry} /> : null}
        {!loading || data.items.length > 0 ? <RepositoryList items={data.items} onSelect={setSelected} /> : null}
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
  filterItem: { minWidth: 260, flex: 1 },
  filterItemSmall: { minWidth: 180 },
  helper: { fontSize: 14, lineHeight: 21 },
  lookupResult: { borderWidth: 1, borderRadius: 16, padding: spacing.lg, gap: spacing.sm },
  resultTitle: { fontSize: 16, fontWeight: "900" },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.sm }
});
