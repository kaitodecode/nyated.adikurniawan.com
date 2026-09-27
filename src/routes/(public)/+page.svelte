<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import AdSlot from '$lib/components/AdSlot.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>nyated. — Artikel & catatan</title>
	<meta
		name="description"
		content="Kumpulan artikel dan catatan seputar teknologi, pengembangan perangkat lunak, dan hal-hal menarik lainnya."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="nyated. — Artikel & catatan" />
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
	<div class="grid gap-10 lg:grid-cols-[1fr_260px]">
		<div>
			<h1
				class="mb-8 text-2xl font-bold tracking-tighter-heading text-ink-950 sm:text-3xl dark:text-white"
			>
				Artikel terbaru
			</h1>

			{#if data.items.length === 0}
				<p class="text-ink-500 dark:text-ink-400">Belum ada artikel yang dipublikasikan.</p>
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
				buildHref={(p) => (p === 1 ? '/' : `/?page=${p}`)}
			/>
		</div>

		<aside class="hidden lg:block">
			<div class="sticky top-20">
				<AdSlot layout="sidebar" />
			</div>
		</aside>
	</div>
</div>
