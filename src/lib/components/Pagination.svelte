<script lang="ts">
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
			class="inline-flex size-9 items-center justify-center rounded-md border border-ink-900/10 text-ink-700 hover:bg-ink-900/5 aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>

		<div class="flex gap-1 text-sm">
			{#each pages as p (p)}
				<a
					href={buildHref(p)}
					class="inline-flex size-9 items-center justify-center rounded-md transition-colors {p === page
						? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
						: 'text-ink-700 hover:bg-ink-900/5 dark:text-white/70 dark:hover:bg-white/10'}"
				>
					{p}
				</a>
			{/each}
		</div>

		<a
			href={buildHref(Math.min(totalPages, page + 1))}
			aria-disabled={page === totalPages}
			aria-label="Selanjutnya"
			class="inline-flex size-9 items-center justify-center rounded-md border border-ink-900/10 text-ink-700 hover:bg-ink-900/5 aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>
	</nav>
{/if}
