<script lang="ts">
	import type { PageData } from './$types';
	import Badge from '$lib/components/ui/Badge.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Kategori — nyated.</title>
	<meta name="description" content="Jelajahi artikel berdasarkan kategori dan tag." />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
	<p class="kicker mb-2">Jelajahi</p>
	<h1 class="mb-8 text-2xl font-bold tracking-tighter-heading text-ink-950 sm:text-3xl dark:text-white">
		Kategori
	</h1>

	{#if data.tags.length === 0}
		<p class="text-ink-500 dark:text-ink-400">Belum ada kategori.</p>
	{:else}
		<div class="flex flex-wrap gap-2">
			{#each data.tags as tag (tag)}
				<Badge href={`/category/${tag}`} class="px-4 py-1.5 text-sm">{tag}</Badge>
			{/each}
		</div>
	{/if}
</div>
