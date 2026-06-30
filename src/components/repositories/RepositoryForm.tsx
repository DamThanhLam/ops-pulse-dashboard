import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SwitchField } from "@/components/ui/SwitchField";
import { CreateGithubRepositoryRequest, GithubRepository } from "@/types/githubRepository";
import { githubRepositoryCreateSchema, GithubRepositoryCreateFormValues } from "@/validation/githubRepository.schema";
import { spacing } from "@/theme/spacing";
import { optionalText } from "@/utils/payload";

type RepositoryFormProps = {
  initialValues?: Partial<GithubRepository>;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (values: CreateGithubRepositoryRequest) => Promise<void> | void;
};

export function RepositoryForm({ initialValues, submitLabel = "Save repository", loading, onSubmit }: RepositoryFormProps) {
  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<GithubRepositoryCreateFormValues>({
    resolver: zodResolver(githubRepositoryCreateSchema),
    values: {
      githubRepoId: initialValues?.githubRepoId === undefined ? "" : String(initialValues.githubRepoId),
      ownerName: initialValues?.ownerName ?? "",
      repoName: initialValues?.repoName ?? "",
      fullName: initialValues?.fullName ?? "",
      secret: initialValues?.secret ?? "",
      defaultBranch: initialValues?.defaultBranch ?? "main",
      htmlUrl: initialValues?.htmlUrl ?? "",
      active: initialValues?.active ?? true
    }
  });

  const ownerName = watch("ownerName");
  const repoName = watch("repoName");

  const submit = async (values: GithubRepositoryCreateFormValues) => {
    const fullName = optionalText(values.fullName) ?? `${values.ownerName.trim()}/${values.repoName.trim()}`;
    await onSubmit({
      githubRepoId: values.githubRepoId.trim(),
      ownerName: values.ownerName.trim(),
      repoName: values.repoName.trim(),
      fullName,
      secret: optionalText(values.secret),
      defaultBranch: optionalText(values.defaultBranch),
      htmlUrl: optionalText(values.htmlUrl),
      active: values.active ?? true
    });
    if (!initialValues) reset();
  };

  return (
    <View style={styles.form}>
      <View style={styles.grid}>
        <Controller control={control} name="githubRepoId" render={({ field }) => (
          <Input label="GitHub Repo ID" value={field.value} onChangeText={field.onChange} error={errors.githubRepoId?.message} />
        )} />
        <Controller control={control} name="ownerName" render={({ field }) => (
          <Input label="Owner Name" value={field.value} onChangeText={field.onChange} error={errors.ownerName?.message} />
        )} />
        <Controller control={control} name="repoName" render={({ field }) => (
          <Input label="Repo Name" value={field.value} onChangeText={field.onChange} error={errors.repoName?.message} />
        )} />
        <Controller control={control} name="fullName" render={({ field }) => (
          <Input
            label="Full Name"
            value={field.value}
            onChangeText={field.onChange}
            helperText={`Auto if empty: ${ownerName || "owner"}/${repoName || "repo"}`}
          />
        )} />
        <Controller control={control} name="secret" render={({ field }) => (
          <Input label="Webhook Secret" value={field.value} onChangeText={field.onChange} secureTextEntry />
        )} />
        <Controller control={control} name="defaultBranch" render={({ field }) => (
          <Input label="Default Branch" value={field.value} onChangeText={field.onChange} />
        )} />
        <Controller control={control} name="htmlUrl" render={({ field }) => (
          <Input label="HTML URL" value={field.value} onChangeText={field.onChange} keyboardType="url" />
        )} />
        <Controller control={control} name="active" render={({ field }) => (
          <SwitchField label="Active" value={field.value ?? true} onValueChange={field.onChange} />
        )} />
      </View>
      <Button title={submitLabel} loading={loading} onPress={handleSubmit(submit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg
  }
});
