export type CreateGithubRepositoryRequest = {
  githubRepoId: string;
  ownerName: string;
  repoName: string;
  fullName?: string;
  secret?: string;
  defaultBranch?: string;
  htmlUrl?: string;
  active?: boolean;
};

export type UpdateGithubRepositoryRequest = {
  ownerName?: string;
  repoName?: string;
  fullName?: string;
  secret?: string;
  defaultBranch?: string;
  htmlUrl?: string;
  active?: boolean;
};

export type GithubRepository = Omit<CreateGithubRepositoryRequest, "githubRepoId"> & {
  id?: string;
  repositoryId?: string;
  systemRepositoryId?: string;
  githubRepoId?: string | number;
  githubRepositoryId?: string | number;
  name?: string;
  owner?: string;
  status?: string;
  enabled?: boolean;
  private?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GitHubRepositoryLookupResult = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  htmlUrl: string;
};
