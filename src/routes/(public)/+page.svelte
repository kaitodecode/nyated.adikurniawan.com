<script lang="ts">
	import { fly } from 'svelte/transition';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import AdSlot from '$lib/components/AdSlot.svelte';
	import CategoryListCard from '$lib/components/CategoryListCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let featured = $derived(data.page === 1 ? data.items[0] : undefined);
	let rest = $derived(data.page === 1 ? data.items.slice(1) : data.items);

	function formatDate(ms: number | null) {
		if (!ms) return '';
		return new Date(ms).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
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
			<p class="kicker mb-2">Artikel terbaru</p>
			<h1
				class="mb-8 text-2xl font-bold tracking-tighter-heading text-ink-950 sm:text-3xl dark:text-white"
			>
				Tulisan &amp; catatan
			</h1>

			{#if data.items.length === 0}
				<p class="text-ink-500 dark:text-ink-400">Belum ada artikel yang dipublikasikan.</p>
			{:else}
				{#if featured}
					<a
						href={`/article/${featured.slug}`}
						in:fly={{ y: 10, duration: 300 }}
						class="group mb-10 grid gap-5 overflow-hidden rounded-xl border border-ink-900/10 bg-white transition-all hover:-translate-y-0.5 hover:border-ink-900/20 hover:shadow-[0_8px_24px_-12px_rgba(15,17,21,0.18)] sm:grid-cols-[1.1fr_1fr] dark:border-white/10 dark:bg-ink-900 dark:hover:border-white/20"
					>
						{#if featured.coverImage}
							<div class="aspect-[16/10] overflow-hidden bg-ink-900/5 sm:aspect-auto dark:bg-white/5">
								<img
									src={featured.coverImage}
									alt={featured.title}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
								/>
							</div>
						{/if}
						<div class="flex flex-col justify-center p-6 sm:p-8">
							<span class="kicker mb-3">Terbaru</span>
							<h2
								class="text-xl leading-snug font-semibold tracking-tighter-heading text-ink-950 transition-colors group-hover:text-accent sm:text-2xl dark:text-white"
							>
								{featured.title}
							</h2>
							<p class="mt-2 line-clamp-3 text-sm text-ink-600 dark:text-ink-400">
								{featured.excerpt}
							</p>
							<time
								class="mt-4 text-xs text-ink-500 dark:text-ink-400"
								datetime={new Date(featured.publishedAt ?? featured.createdAt).toISOString()}
							>
								{formatDate(featured.publishedAt ?? featured.createdAt)}
							</time>
						</div>
					</a>
				{/if}

				<div class="grid gap-x-8 gap-y-10 sm:grid-cols-2">
					{#each rest as article, i (article.id)}
						<div in:fly={{ y: 10, duration: 250, delay: Math.min(i, 4) * 40 }}>
							<ArticleCard {article} />
						</div>
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
			<div class="sticky top-20 space-y-6">
				<CategoryListCard tags={data.tags} />
				<AdSlot layout="sidebar" />
			</div>
		</aside>
	</div>
</div>
