<script lang="ts">
	import type { ArticleListItem } from '$lib/types/article';

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

<article class="group">
	<a href={`/article/${article.slug}`} class="block">
		{#if article.coverImage}
			<div class="mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-ink-900/5">
				<img
					src={article.coverImage}
					alt={article.title}
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
				/>
			</div>
		{/if}
		<h2
			class="text-lg font-semibold leading-snug text-ink-950 transition-colors group-hover:text-accent"
		>
			{article.title}
		</h2>
	</a>
	<p class="mt-1.5 line-clamp-2 text-sm text-ink-700">{article.excerpt}</p>
	<div class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
		<time datetime={new Date(article.publishedAt ?? article.createdAt).toISOString()}>
			{formatDate(article.publishedAt ?? article.createdAt)}
		</time>
		{#if article.tags.length}
			<span aria-hidden="true">&middot;</span>
			<div class="flex flex-wrap gap-1.5">
				{#each article.tags.slice(0, 3) as tag (tag)}
					<a
						href={`/category/${tag}`}
						class="rounded-full bg-ink-900/5 px-2 py-0.5 hover:bg-ink-900/10"
					>
						{tag}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</article>
