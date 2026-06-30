export type ParsedGitHubRepositoryInput = {
  owner: string;
  repo: string;
};

const ownerRepoPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export function parseGitHubRepositoryInput(input: string): ParsedGitHubRepositoryInput {
  const value = input.trim();

  if (!value) {
    throw new Error("Enter a GitHub repository as owner/repo or a GitHub URL.");
  }

  let candidate = value;

  if (/^https?:\/\//i.test(value)) {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new Error("Invalid GitHub repository URL.");
    }

    if (!/(^|\.)github\.com$/i.test(url.hostname)) {
      throw new Error("Only github.com repository URLs are supported.");
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      throw new Error("GitHub URL must include owner and repository name.");
    }
    candidate = `${parts[0]}/${parts[1]}`;
  }

  candidate = candidate.replace(/\.git$/i, "");

  if (!ownerRepoPattern.test(candidate)) {
    throw new Error("Use owner/repo, for example facebook/react.");
  }

  const [owner, repo] = candidate.split("/");
  return { owner, repo };
}
