<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Kategori — nyated.</title>
	<meta name="description" content="Jelajahi artikel berdasarkan kategori dan tag." />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
	<h1 class="mb-8 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">Kategori</h1>

	{#if data.tags.length === 0}
		<p class="text-ink-500">Belum ada kategori.</p>
	{:else}
		<div class="flex flex-wrap gap-2">
			{#each data.tags as tag (tag)}
				<a
					href={`/category/${tag}`}
					class="rounded-full bg-ink-900/5 px-4 py-1.5 text-sm text-ink-700 hover:bg-ink-900/10"
				>
					{tag}
				</a>
			{/each}
		</div>
	{/if}
</div>
