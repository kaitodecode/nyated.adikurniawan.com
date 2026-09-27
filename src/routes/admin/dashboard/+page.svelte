<script lang="ts">
	import StatCard from '$lib/components/StatCard.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import FileCheck from '@lucide/svelte/icons/file-check';
	import FileEdit from '@lucide/svelte/icons/file-edit';
	import Eye from '@lucide/svelte/icons/eye';
	import Files from '@lucide/svelte/icons/files';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let stats = $derived(data.stats);

	function formatShortDate(date: string) {
		return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
	}
</script>

<svelte:head>
	<title>Dashboard — Admin</title>
</svelte:head>

<h1 class="mb-6 text-xl font-semibold tracking-tight text-ink-950 dark:text-white">Dashboard</h1>

<div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
	<StatCard label="Artikel published" value={stats.totalPublished} icon={FileCheck} />
	<StatCard label="Artikel draft" value={stats.totalDraft} icon={FileEdit} />
	<StatCard label="Total views" value={stats.totalViews} icon={Eye} />
	<StatCard label="Total artikel" value={stats.totalPublished + stats.totalDraft} icon={Files} />
</div>

<Card class="mb-8">
	<h2 class="mb-4 text-sm font-medium text-ink-600 dark:text-ink-200">Trafik 14 hari terakhir</h2>
	{#if stats.dailyViews.length}
		<LineChart
			labels={stats.dailyViews.map((d) => formatShortDate(d.date))}
			values={stats.dailyViews.map((d) => d.views)}
		/>
	{:else}
		<p class="text-sm text-ink-500 dark:text-ink-400">Belum ada data trafik.</p>
	{/if}
</Card>

<Card>
	<h2 class="mb-4 text-sm font-medium text-ink-600 dark:text-ink-200">Artikel terpopuler</h2>
	{#if stats.topArticles.length === 0}
		<p class="text-sm text-ink-500 dark:text-ink-400">Belum ada artikel.</p>
	{:else}
		<ol class="divide-y divide-ink-900/5 dark:divide-white/10">
			{#each stats.topArticles as article, i (article.id)}
				<li class="flex items-center justify-between gap-4 py-2.5 text-sm">
					<span class="flex items-center gap-3 truncate">
						<span class="text-ink-500 dark:text-ink-400">{i + 1}.</span>
						<a
							href={`/article/${article.slug}`}
							target="_blank"
							class="truncate text-ink-900 hover:text-accent dark:text-white"
						>
							{article.title}
						</a>
					</span>
					<span class="shrink-0 text-ink-500 dark:text-ink-400">{article.views} views</span>
				</li>
			{/each}
		</ol>
	{/if}
</Card>
