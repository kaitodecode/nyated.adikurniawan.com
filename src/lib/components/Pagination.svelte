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
	<nav class="mt-10 flex items-center justify-center gap-2 text-sm" aria-label="Pagination">
		<a
			href={buildHref(Math.max(1, page - 1))}
			class="rounded-md px-3 py-1.5 text-ink-700 hover:bg-ink-900/5 aria-disabled:pointer-events-none aria-disabled:opacity-40"
			aria-disabled={page === 1}
		>
			&larr; Sebelumnya
		</a>
		<div class="flex gap-1">
			{#each pages as p (p)}
				<a
					href={buildHref(p)}
					class="min-w-8 rounded-md px-2.5 py-1.5 text-center transition-colors {p === page
						? 'bg-ink-950 text-white'
						: 'text-ink-700 hover:bg-ink-900/5'}"
				>
					{p}
				</a>
			{/each}
		</div>
		<a
			href={buildHref(Math.min(totalPages, page + 1))}
			class="rounded-md px-3 py-1.5 text-ink-700 hover:bg-ink-900/5 aria-disabled:pointer-events-none aria-disabled:opacity-40"
			aria-disabled={page === totalPages}
		>
			Selanjutnya &rarr;
		</a>
	</nav>
{/if}
