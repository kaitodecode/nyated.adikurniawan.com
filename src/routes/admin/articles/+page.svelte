<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(ms: number) {
		return new Date(ms).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Artikel — Admin</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-xl font-semibold text-ink-950 dark:text-white">Artikel</h1>
	<Button href="/admin/articles/new">+ Artikel baru</Button>
</div>

<div class="overflow-x-auto rounded-xl border border-ink-900/10 dark:border-white/10">
	<table class="min-w-full divide-y divide-ink-900/10 text-left text-sm dark:divide-white/10">
		<thead class="bg-white text-ink-500 dark:bg-ink-900 dark:text-white/50">
			<tr>
				<th class="whitespace-nowrap px-4 py-3 font-medium">Judul</th>
				<th class="whitespace-nowrap px-4 py-3 font-medium">Status</th>
				<th class="whitespace-nowrap px-4 py-3 font-medium">Views</th>
				<th class="whitespace-nowrap px-4 py-3 font-medium">Diperbarui</th>
				<th class="px-4 py-3"></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-ink-900/5 bg-white dark:divide-white/5 dark:bg-ink-900">
			{#each data.articles as article (article.id)}
				<tr>
					<td class="max-w-xs truncate px-4 py-3 text-ink-900 dark:text-white">{article.title}</td>
					<td class="px-4 py-3">
						<Badge tone={article.status === 'published' ? 'success' : 'neutral'}>
							{article.status === 'published' ? 'Published' : 'Draft'}
						</Badge>
					</td>
					<td class="px-4 py-3 text-ink-500 dark:text-white/50">{article.views}</td>
					<td class="px-4 py-3 text-ink-500 dark:text-white/50">{formatDate(article.createdAt)}</td>
					<td class="px-4 py-3 text-right">
						<div class="flex justify-end gap-3">
							<a href={`/admin/articles/${article.id}`} class="text-accent hover:underline">Edit</a>
							<form
								method="POST"
								action="?/delete"
								use:enhance={({ cancel }) => {
									if (!confirm(`Hapus artikel "${article.title}"?`)) cancel();
								}}
							>
								<input type="hidden" name="id" value={article.id} />
								<button type="submit" class="text-red-600 hover:underline dark:text-red-400">
									Hapus
								</button>
							</form>
						</div>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="5" class="px-4 py-8 text-center text-ink-500 dark:text-white/50">
						Belum ada artikel.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
