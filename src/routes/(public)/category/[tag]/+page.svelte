<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Kategori: {data.tag} — nyated.</title>
	<meta name="description" content={`Artikel dengan kategori ${data.tag}.`} />
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
	<p class="mb-1 text-sm text-ink-500 dark:text-white/50">Kategori</p>
	<h1 class="mb-8 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl dark:text-white">
		{data.tag}
	</h1>

	{#if data.items.length === 0}
		<p class="text-ink-500 dark:text-white/50">Belum ada artikel untuk kategori ini.</p>
	{:else}
		<div class="grid gap-x-8 gap-y-10 sm:grid-cols-2">
			{#each data.items as article (article.id)}
				<ArticleCard {article} />
			{/each}
		</div>
	{/if}

	<Pagination
		page={data.page}
		totalPages={data.totalPages}
		buildHref={(p) => (p === 1 ? `/category/${data.tag}` : `/category/${data.tag}?page=${p}`)}
	/>
</div>
