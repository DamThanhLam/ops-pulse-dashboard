import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GithubWebhookHeaders } from "@/types/webhookEvent";
import { githubWebhookTesterSchema, GithubWebhookTesterFormValues } from "@/validation/webhookEvent.schema";
import { spacing } from "@/theme/spacing";

type Props = {
  loading?: boolean;
  onSubmit: (headers: GithubWebhookHeaders, rawPayload: string) => Promise<void> | void;
};

const samplePayload = JSON.stringify({
  ref: "refs/heads/main",
  repository: {
    id: 123456,
    full_name: "owner/repo",
    html_url: "https://github.com/owner/repo"
  },
  pusher: { name: "developer" },
  sender: { login: "developer", html_url: "https://github.com/developer" },
  commits: [],
  head_commit: {
    id: "abcdef1234567890",
    message: "Initial commit",
    url: "https://github.com/owner/repo/commit/abcdef1234567890",
    timestamp: "2026-06-29T00:00:00Z",
    added: [],
    modified: [],
    removed: []
  },
  compare: "https://github.com/owner/repo/compare/old...new",
  created: false,
  deleted: false,
  forced: false
}, null, 2);

export function GithubWebhookTesterForm({ loading, onSubmit }: Props) {
  const { control, handleSubmit, formState: { errors } } = useForm<GithubWebhookTesterFormValues>({
    resolver: zodResolver(githubWebhookTesterSchema),
    defaultValues: {
      event: "push",
      deliveryId: "github-delivery-id-001",
      signature: "sha256=abcdef123456",
      rawPayload: samplePayload
    }
  });

  const submit = async (values: GithubWebhookTesterFormValues) => {
    await onSubmit(
      {
        event: values.event.trim(),
        deliveryId: values.deliveryId.trim(),
        signature: values.signature.trim()
      },
      values.rawPayload
    );
  };

  return (
    <View style={styles.form}>
      <Controller control={control} name="event" render={({ field }) => (
        <Input label="X-GitHub-Event" value={field.value} onChangeText={field.onChange} error={errors.event?.message} />
      )} />
      <Controller control={control} name="deliveryId" render={({ field }) => (
        <Input label="X-GitHub-Delivery" value={field.value} onChangeText={field.onChange} error={errors.deliveryId?.message} />
      )} />
      <Controller control={control} name="signature" render={({ field }) => (
        <Input label="X-Hub-Signature-256" value={field.value} onChangeText={field.onChange} error={errors.signature?.message} />
      )} />
      <Controller control={control} name="rawPayload" render={({ field }) => (
        <Input label="Raw GitHub Webhook JSON" value={field.value} onChangeText={field.onChange} multiline error={errors.rawPayload?.message} />
      )} />
      <Button title="Send test webhook" loading={loading} onPress={handleSubmit(submit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg }
});
