<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface Props {
		page: number;
		totalPages: number;
		buildHref: (page: number) => string;
	}

	let { page, totalPages, buildHref }: Props = $props();

	let pages = $derived(Array.from({ length: totalPages }, (_, i) => i + 1));
</script>

{#if totalPages > 1}
	<nav class="mt-10 flex items-center justify-center gap-1" aria-label="Pagination">
		<a
			href={buildHref(Math.max(1, page - 1))}
			aria-disabled={page === 1}
			aria-label="Sebelumnya"
			class="inline-flex size-9 items-center justify-center rounded-lg border border-ink-900/10 text-ink-600 hover:bg-ink-900/5 aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-white/10 dark:text-ink-200 dark:hover:bg-white/10"
		>
			<ChevronLeft class="size-4" />
		</a>

		<div class="flex gap-1 text-sm">
			{#each pages as p (p)}
				<a
					href={buildHref(p)}
					class="inline-flex size-9 items-center justify-center rounded-lg transition-colors {p ===
					page
						? 'bg-accent text-white'
						: 'text-ink-600 hover:bg-ink-900/5 dark:text-ink-200 dark:hover:bg-white/10'}"
				>
					{p}
				</a>
			{/each}
		</div>

		<a
			href={buildHref(Math.min(totalPages, page + 1))}
			aria-disabled={page === totalPages}
			aria-label="Selanjutnya"
			class="inline-flex size-9 items-center justify-center rounded-lg border border-ink-900/10 text-ink-600 hover:bg-ink-900/5 aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-white/10 dark:text-ink-200 dark:hover:bg-white/10"
		>
			<ChevronRight class="size-4" />
		</a>
	</nav>
{/if}
