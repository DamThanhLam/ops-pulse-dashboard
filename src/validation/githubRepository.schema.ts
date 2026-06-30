import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const githubRepositoryCreateSchema = z.object({
  githubRepoId: z.string().trim().min(1, "GitHub Repo ID is required"),
  ownerName: z.string().trim().min(1, "Owner Name is required"),
  repoName: z.string().trim().min(1, "Repo Name is required"),
  fullName: optionalText,
  secret: optionalText,
  defaultBranch: optionalText,
  htmlUrl: optionalText,
  active: z.boolean().default(true)
});

export const githubRepositoryUpdateSchema = z.object({
  ownerName: optionalText,
  repoName: optionalText,
  fullName: optionalText,
  secret: optionalText,
  defaultBranch: optionalText,
  htmlUrl: optionalText,
  active: z.boolean().default(true)
});

export type GithubRepositoryCreateFormValues = z.input<typeof githubRepositoryCreateSchema>;
export type GithubRepositoryUpdateFormValues = z.input<typeof githubRepositoryUpdateSchema>;
