<script lang="ts">
	import { enhance } from '$app/forms';
	import MarkdownEditor from './MarkdownEditor.svelte';
	import { uploadArticleImage } from '$lib/firebase/storage';
	import type { ArticleStatus } from '$lib/types/article';

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
		<p class="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
	{/if}

	<div class="grid gap-6 lg:grid-cols-[1fr_280px]">
		<div class="min-w-0 space-y-5">
			<label class="block text-sm">
				<span class="mb-1 block text-ink-700">Judul</span>
				<input
					name="title"
					bind:value={title}
					required
					class="w-full rounded-md border border-ink-900/15 px-3 py-2 text-lg font-medium outline-none focus:border-accent"
				/>
			</label>

			<div>
				<span class="mb-1 block text-sm text-ink-700">Konten (Markdown)</span>
				<input type="hidden" name="content" value={content} />
				<MarkdownEditor value={content} onchange={(v) => (content = v)} />
			</div>
		</div>

		<aside class="space-y-5">
			<div class="rounded-xl border border-ink-900/10 bg-white p-4">
				<span class="mb-2 block text-sm font-medium text-ink-700">Status</span>
				<select
					name="status"
					bind:value={status}
					class="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
				>
					<option value="draft">Draft</option>
					<option value="published">Published</option>
				</select>
			</div>

			<div class="rounded-xl border border-ink-900/10 bg-white p-4">
				<span class="mb-2 block text-sm font-medium text-ink-700">Cover image</span>
				<input type="hidden" name="coverImage" value={coverImage ?? ''} />
				{#if coverImage}
					<img src={coverImage} alt="Cover" class="mb-2 aspect-video w-full rounded-md object-cover" />
				{/if}
				<label
					class="block w-full cursor-pointer rounded-md border border-ink-900/15 px-3 py-1.5 text-center text-xs text-ink-700 hover:bg-ink-900/5"
				>
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
					<p class="mt-1 text-xs text-red-600">{coverError}</p>
				{/if}
			</div>

			<div class="rounded-xl border border-ink-900/10 bg-white p-4">
				<label class="block text-sm">
					<span class="mb-1 block font-medium text-ink-700">Tags</span>
					<input
						name="tags"
						bind:value={tagsInput}
						placeholder="teknologi, tutorial"
						class="w-full rounded-md border border-ink-900/15 px-3 py-2 text-sm"
					/>
					<span class="mt-1 block text-xs text-ink-500">Pisahkan dengan koma</span>
				</label>
			</div>

			<button
				type="submit"
				disabled={submitting}
				class="w-full rounded-md bg-ink-950 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
			>
				{submitting ? 'Menyimpan…' : submitLabel}
			</button>
		</aside>
	</div>
</form>
