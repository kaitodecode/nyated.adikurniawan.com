<script lang="ts">
	import type { ArticleListItem } from '$lib/types/article';
	import Badge from '$lib/components/ui/Badge.svelte';

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
	class="group overflow-hidden rounded-xl border border-ink-900/10 bg-white transition-shadow hover:shadow-md dark:border-white/10 dark:bg-ink-900"
>
	<a href={`/article/${article.slug}`} class="block">
		{#if article.coverImage}
			<div class="aspect-[16/9] overflow-hidden bg-ink-900/5 dark:bg-white/5">
				<img
					src={article.coverImage}
					alt={article.title}
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
				/>
			</div>
		{/if}
		<div class="p-4">
			<h2
				class="text-lg font-semibold leading-snug text-ink-950 transition-colors group-hover:text-accent dark:text-white"
			>
				{article.title}
			</h2>
			<p class="mt-1.5 line-clamp-2 text-sm text-ink-700 dark:text-white/60">{article.excerpt}</p>
		</div>
	</a>
	<div class="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pb-4 text-xs text-ink-500 dark:text-white/40">
		<time datetime={new Date(article.publishedAt ?? article.createdAt).toISOString()}>
			{formatDate(article.publishedAt ?? article.createdAt)}
		</time>
		{#if article.tags.length}
			<span aria-hidden="true">&middot;</span>
			<div class="flex flex-wrap gap-1.5">
				{#each article.tags.slice(0, 3) as tag (tag)}
					<Badge href={`/category/${tag}`}>{tag}</Badge>
				{/each}
			</div>
		{/if}
	</div>
</article>
