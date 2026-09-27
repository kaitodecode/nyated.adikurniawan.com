<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/', label: 'Beranda' },
		{ href: '/category', label: 'Kategori' }
	];
</script>

<header class="border-b border-ink-900/10 bg-paper/90 backdrop-blur">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
		<a href="/" class="text-lg font-semibold tracking-tight text-ink-950"> nyated. </a>
		<nav class="flex items-center gap-5 text-sm text-ink-700">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="transition-colors hover:text-ink-950"
					class:text-ink-950={page.url.pathname === link.href}
					class:font-medium={page.url.pathname === link.href}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</div>
</header>
