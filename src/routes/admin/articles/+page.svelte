<script lang="ts">
	import { enhance } from '$app/forms';
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
	<h1 class="text-xl font-semibold text-ink-950">Artikel</h1>
	<a
		href="/admin/articles/new"
		class="rounded-md bg-ink-950 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
	>
		+ Artikel baru
	</a>
</div>

<div class="overflow-hidden rounded-xl border border-ink-900/10 bg-white">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-ink-900/10 text-ink-500">
			<tr>
				<th class="px-4 py-3 font-medium">Judul</th>
				<th class="px-4 py-3 font-medium">Status</th>
				<th class="px-4 py-3 font-medium">Views</th>
				<th class="px-4 py-3 font-medium">Diperbarui</th>
				<th class="px-4 py-3"></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-ink-900/5">
			{#each data.articles as article (article.id)}
				<tr>
					<td class="max-w-xs truncate px-4 py-3">{article.title}</td>
					<td class="px-4 py-3">
						<span
							class="rounded-full px-2 py-0.5 text-xs {article.status === 'published'
								? 'bg-green-100 text-green-700'
								: 'bg-ink-900/5 text-ink-500'}"
						>
							{article.status === 'published' ? 'Published' : 'Draft'}
						</span>
					</td>
					<td class="px-4 py-3 text-ink-500">{article.views}</td>
					<td class="px-4 py-3 text-ink-500">{formatDate(article.createdAt)}</td>
					<td class="px-4 py-3 text-right">
						<div class="flex justify-end gap-2">
							<a href={`/admin/articles/${article.id}`} class="text-accent hover:underline">Edit</a>
							<form
								method="POST"
								action="?/delete"
								use:enhance={({ cancel }) => {
									if (!confirm(`Hapus artikel "${article.title}"?`)) cancel();
								}}
							>
								<input type="hidden" name="id" value={article.id} />
								<button type="submit" class="text-red-600 hover:underline">Hapus</button>
							</form>
						</div>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="5" class="px-4 py-8 text-center text-ink-500">Belum ada artikel.</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
