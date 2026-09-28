<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tags from '@lucide/svelte/icons/tags';

	interface Props {
		tags: string[];
		max?: number;
	}

	let { tags, max = 8 }: Props = $props();

	let visible = $derived(tags.slice(0, max));
	let hasMore = $derived(tags.length > max);
</script>

{#if tags.length > 0}
	<Card>
		<div class="mb-3 flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-ink-200">
			<Tags class="size-4 text-accent" />
			Kategori
		</div>
		<div class="flex flex-wrap gap-1.5">
			{#each visible as tag (tag)}
				<Badge href={`/category/${tag}`} class="transition-transform hover:scale-105">{tag}</Badge>
			{/each}
		</div>
		{#if hasMore}
			<a
				href="/category"
				class="mt-3 inline-block text-xs font-medium text-accent hover:underline"
			>
				Lihat semua &rarr;
			</a>
		{/if}
	</Card>
{/if}
