<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/', label: 'Beranda' },
		{ href: '/category', label: 'Kategori' }
	];

	let mobileOpen = $state(false);
</script>

<header class="border-b border-ink-900/10 bg-paper/90 backdrop-blur dark:border-white/10 dark:bg-ink-950/90">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
		<a href="/" class="text-lg font-semibold tracking-tight text-ink-950 dark:text-white">
			nyated.
		</a>

		<nav class="hidden items-center gap-5 text-sm text-ink-700 md:flex dark:text-white/70">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="transition-colors hover:text-ink-950 dark:hover:text-white"
					class:text-ink-950={page.url.pathname === link.href}
					class:dark:text-white={page.url.pathname === link.href}
					class:font-medium={page.url.pathname === link.href}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<button
			type="button"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Buka menu"
			aria-expanded={mobileOpen}
			class="inline-flex items-center justify-center rounded-md p-2 text-ink-700 hover:bg-ink-900/5 md:hidden dark:text-white/70 dark:hover:bg-white/10"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor">
				{#if mobileOpen}
					<path
						fill-rule="evenodd"
						d="M14.707 5.293a1 1 0 010 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586l3.293-3.293a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				{:else}
					<path
						fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/>
				{/if}
			</svg>
		</button>
	</div>

	{#if mobileOpen}
		<nav
			class="flex flex-col gap-1 border-t border-ink-900/10 px-4 py-3 text-sm text-ink-700 md:hidden dark:border-white/10 dark:text-white/70"
		>
			{#each links as link (link.href)}
				<a
					href={link.href}
					onclick={() => (mobileOpen = false)}
					class="rounded-md px-2 py-2 hover:bg-ink-900/5 dark:hover:bg-white/10"
					class:text-ink-950={page.url.pathname === link.href}
					class:dark:text-white={page.url.pathname === link.href}
					class:font-medium={page.url.pathname === link.href}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>
