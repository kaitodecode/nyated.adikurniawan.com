<script lang="ts">
	import type { ArticleListItem } from '$lib/types/article';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Clock from '@lucide/svelte/icons/clock';

	interface Props {
		article: ArticleListItem;
	}

	let { article }: Props = $props();

	function formatDate(ms: number | null) {
		if (!ms) return '';
		return new Date(ms).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<article
	class="group overflow-hidden rounded-xl border border-ink-900/10 bg-white transition-all hover:-translate-y-0.5 hover:border-ink-900/20 hover:shadow-[0_8px_24px_-12px_rgba(15,17,21,0.18)] dark:border-white/10 dark:bg-ink-900 dark:hover:border-white/20"
>
	<a href={`/article/${article.slug}`} class="block">
		{#if article.coverImage}
			<div class="aspect-[16/9] overflow-hidden bg-ink-900/5 dark:bg-white/5">
				<img
					src={article.coverImage}
					alt={article.title}
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
				/>
			</div>
		{/if}
		<div class="p-5">
			<h2
				class="text-lg leading-snug font-semibold tracking-tight text-ink-950 transition-colors group-hover:text-accent dark:text-white"
			>
				{article.title}
			</h2>
			<p class="mt-1.5 line-clamp-2 text-sm text-ink-600 dark:text-ink-400">{article.excerpt}</p>
		</div>
	</a>
	<div
		class="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 pb-5 text-xs text-ink-500 dark:text-ink-400"
	>
		<span class="inline-flex items-center gap-1">
			<Clock class="size-3.5" />
			<time datetime={new Date(article.publishedAt ?? article.createdAt).toISOString()}>
				{formatDate(article.publishedAt ?? article.createdAt)}
			</time>
		</span>
		{#if article.tags.length}
			<div class="flex flex-wrap gap-1.5">
				{#each article.tags.slice(0, 3) as tag (tag)}
					<Badge href={`/category/${tag}`}>{tag}</Badge>
				{/each}
			</div>
		{/if}
	</div>
</article>
