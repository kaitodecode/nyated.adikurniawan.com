<script lang="ts">
	import ArticleContent from '$lib/components/ArticleContent.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import AdSlot from '$lib/components/AdSlot.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { page } from '$app/state';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let article = $derived(data.article);

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
	<title>{article.title} — nyated.</title>
	<meta name="description" content={article.excerpt} />
	<link rel="canonical" href={page.url.href} />

	<meta property="og:type" content="article" />
	<meta property="og:title" content={article.title} />
	<meta property="og:description" content={article.excerpt} />
	<meta property="og:url" content={page.url.href} />
	{#if article.coverImage}
		<meta property="og:image" content={article.coverImage} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={article.title} />
	<meta name="twitter:description" content={article.excerpt} />
</svelte:head>

<article class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
	<div class="grid gap-10 lg:grid-cols-[1fr_260px]">
		<div class="min-w-0">
			<header class="mb-8">
				<h1
					class="text-3xl leading-tight font-bold tracking-tighter-heading text-ink-950 sm:text-4xl dark:text-white"
				>
					{article.title}
				</h1>
				<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500 dark:text-ink-400">
					<span>{article.authorName}</span>
					<span aria-hidden="true">&middot;</span>
					<time datetime={new Date(article.publishedAt ?? article.createdAt).toISOString()}>
						{formatDate(article.publishedAt ?? article.createdAt)}
					</time>
					<span aria-hidden="true">&middot;</span>
					<span>{article.views} views</span>
				</div>
				{#if article.tags.length}
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each article.tags as tag (tag)}
							<Badge href={`/category/${tag}`}>{tag}</Badge>
						{/each}
					</div>
				{/if}
			</header>

			{#if article.coverImage}
				<div class="mb-8 overflow-hidden rounded-xl bg-ink-900/5 dark:bg-white/5">
					<img src={article.coverImage} alt={article.title} class="w-full object-cover" />
				</div>
			{/if}

			<ArticleContent html={data.html} />

			<div class="mt-10">
				<AdSlot layout="footer" />
			</div>

			{#if data.related.length}
				<section class="mt-14 border-t border-ink-900/10 pt-8 dark:border-white/10">
					<h2 class="mb-6 text-lg font-semibold tracking-tight text-ink-950 dark:text-white">
						Artikel terkait
					</h2>
					<div class="grid gap-x-8 gap-y-8 sm:grid-cols-2">
						{#each data.related as related (related.id)}
							<ArticleCard article={related} />
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<aside class="hidden lg:block">
			<div class="sticky top-20">
				<AdSlot layout="sidebar" />
			</div>
		</aside>
	</div>
</article>
