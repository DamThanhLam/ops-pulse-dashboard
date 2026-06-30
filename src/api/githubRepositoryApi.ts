import { apiClient } from "./apiClient";
import {
  CreateGithubRepositoryRequest,
  GithubRepository,
  GitHubRepositoryLookupResult,
  UpdateGithubRepositoryRequest
} from "@/types/githubRepository";
import { PageQueryParams, PaginatedResponse } from "@/types/api";
import { normalizePaginatedResponse } from "@/utils/pagination";
import { parseGitHubRepositoryInput } from "@/utils/github";

export const githubRepositoryApi = {
  list: async (params: PageQueryParams) => {
    const response = await apiClient.get<unknown>("/github/repositories", params);
    return normalizePaginatedResponse<GithubRepository>(response, params);
  },

  create: (body: CreateGithubRepositoryRequest) =>
    apiClient.post<GithubRepository, CreateGithubRepositoryRequest>("/github/repositories", body),

  update: (githubRepoId: string, body: UpdateGithubRepositoryRequest) =>
    apiClient.put<GithubRepository, UpdateGithubRepositoryRequest>(
      `/github/repositories/${encodeURIComponent(githubRepoId)}`,
      body
    ),

  get: (githubRepoId: string) =>
    apiClient.get<GithubRepository>(`/github/repositories/${encodeURIComponent(githubRepoId)}`)
};

type GitHubApiRepository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  owner?: { login?: string };
};

export async function lookupGitHubRepository(input: string): Promise<GitHubRepositoryLookupResult> {
  const { owner, repo } = parseGitHubRepositoryInput(input);
  const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository not found. Check the owner/repo value or whether the repository is public.");
    }
    throw new Error("GitHub lookup failed. Try again later or use a backend proxy for private repositories.");
  }

  const payload = (await response.json()) as GitHubApiRepository;

  return {
    id: payload.id,
    name: payload.name,
    fullName: payload.full_name,
    owner: payload.owner?.login ?? owner,
    private: payload.private,
    htmlUrl: payload.html_url
  };
}
