<script lang="ts">
	import { enhance } from '$app/forms';
	import MarkdownEditor from './MarkdownEditor.svelte';
	import { uploadArticleImage } from '$lib/supabase/storage';
	import type { ArticleStatus } from '$lib/types/article';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Upload from '@lucide/svelte/icons/upload';

	interface Props {
		initial?: {
			title: string;
			content: string;
			tags: string[];
			coverImage: string | null;
			status: ArticleStatus;
		};
		submitLabel?: string;
	}

	let {
		initial = { title: '', content: '', tags: [], coverImage: null, status: 'draft' },
		submitLabel = 'Simpan'
	}: Props = $props();

	let title = $state(initial.title);
	let content = $state(initial.content);
	let tagsInput = $state(initial.tags.join(', '));
	let coverImage = $state(initial.coverImage);
	let status = $state<ArticleStatus>(initial.status);
	let coverUploading = $state(false);
	let coverError = $state('');
	let submitting = $state(false);
	let serverError = $state('');

	async function handleCoverPick(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		coverUploading = true;
		coverError = '';
		try {
			coverImage = await uploadArticleImage(file);
		} catch (err) {
			coverError = err instanceof Error ? err.message : 'Upload gagal';
		} finally {
			coverUploading = false;
			input.value = '';
		}
	}
</script>

<form
	method="POST"
	use:enhance={() => {
		submitting = true;
		serverError = '';
		return async ({ result, update }) => {
			submitting = false;
			if (result.type === 'failure') {
				serverError = (result.data?.error as string) ?? 'Gagal menyimpan artikel.';
			}
			await update();
		};
	}}
>
	{#if serverError}
		<Alert tone="error" class="mb-4">{serverError}</Alert>
	{/if}

	<div class="grid gap-6 lg:grid-cols-[1fr_280px]">
		<div class="min-w-0 space-y-5">
			<Input name="title" bind:value={title} required class="text-lg font-medium" label="Judul" />

			<div>
				<span class="mb-1 block text-sm text-ink-600 dark:text-ink-200">Konten (Markdown)</span>
				<input type="hidden" name="content" value={content} />
				<MarkdownEditor value={content} onchange={(v) => (content = v)} />
			</div>
		</div>

		<aside class="space-y-5">
			<Card padding="sm">
				<Select name="status" bind:value={status} label="Status">
					<option value="draft">Draft</option>
					<option value="published">Published</option>
				</Select>
			</Card>

			<Card padding="sm">
				<span class="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-200">Cover image</span>
				<input type="hidden" name="coverImage" value={coverImage ?? ''} />
				{#if coverImage}
					<img src={coverImage} alt="Cover" class="mb-2 aspect-video w-full rounded-lg object-cover" />
				{/if}
				<label
					class="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-ink-900/15 px-3 py-1.5 text-center text-xs text-ink-600 hover:bg-ink-900/5 dark:border-white/15 dark:text-ink-200 dark:hover:bg-white/10"
				>
					<Upload class="size-3.5" />
					{coverUploading ? 'Mengunggah…' : coverImage ? 'Ganti gambar' : 'Unggah gambar'}
					<input
						type="file"
						accept="image/*"
						class="hidden"
						onchange={handleCoverPick}
						disabled={coverUploading}
					/>
				</label>
				{#if coverError}
					<p class="mt-1 text-xs text-danger">{coverError}</p>
				{/if}
			</Card>

			<Card padding="sm">
				<Input
					name="tags"
					bind:value={tagsInput}
					label="Tags"
					placeholder="teknologi, tutorial"
					hint="Pisahkan dengan koma"
				/>
			</Card>

			<Button type="submit" disabled={submitting} class="w-full">
				{submitting ? 'Menyimpan…' : submitLabel}
			</Button>
		</aside>
	</div>
</form>
