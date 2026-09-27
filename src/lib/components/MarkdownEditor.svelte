<script lang="ts">
	import { renderMarkdownPreview } from '$lib/utils/markdown-client';
	import { uploadArticleImage } from '$lib/supabase/storage';
	import Image from '@lucide/svelte/icons/image';

	interface Props {
		value: string;
		onchange: (value: string) => void;
	}

	let { value, onchange }: Props = $props();

	let textarea: HTMLTextAreaElement;
	let uploading = $state(false);
	let uploadError = $state('');

	let previewHtml = $derived(renderMarkdownPreview(value));

	function insertAtCursor(snippet: string) {
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const next = value.slice(0, start) + snippet + value.slice(end);
		onchange(next);

		requestAnimationFrame(() => {
			textarea.focus();
			textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
		});
	}

	async function handleImagePick(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		uploading = true;
		uploadError = '';

		try {
			const url = await uploadArticleImage(file);
			insertAtCursor(`\n![${file.name}](${url})\n`);
		} catch (err) {
			uploadError = err instanceof Error ? err.message : 'Upload gagal';
		} finally {
			uploading = false;
			input.value = '';
		}
	}
</script>

<div>
	<div class="mb-2 flex items-center gap-3">
		<label
			class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-ink-900/15 px-3 py-1.5 text-xs text-ink-600 hover:bg-ink-900/5 dark:border-white/15 dark:text-ink-200 dark:hover:bg-white/10"
		>
			<Image class="size-3.5" />
			{uploading ? 'Mengunggah…' : 'Sisipkan gambar'}
			<input type="file" accept="image/*" class="hidden" onchange={handleImagePick} disabled={uploading} />
		</label>
		{#if uploadError}
			<span class="text-xs text-danger">{uploadError}</span>
		{/if}
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<textarea
			bind:this={textarea}
			value={value}
			oninput={(e) => onchange((e.target as HTMLTextAreaElement).value)}
			rows="20"
			placeholder="Tulis artikel dalam Markdown…"
			class="w-full rounded-lg border border-ink-900/15 bg-white p-3 font-mono text-sm text-ink-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/15 dark:bg-ink-900 dark:text-white"
		></textarea>

		<div
			class="prose prose-sm prose-neutral max-w-none overflow-y-auto rounded-lg border border-ink-900/15 p-3 dark:border-white/15 dark:prose-invert"
		>
			{#if value.trim()}
				{@html previewHtml}
			{:else}
				<p class="text-ink-500 dark:text-ink-400">Pratinjau akan muncul di sini…</p>
			{/if}
		</div>
	</div>
</div>
