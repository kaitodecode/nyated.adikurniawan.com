<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from './ThemeToggle.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';

	const links = [
		{ href: '/', label: 'Beranda' },
		{ href: '/category', label: 'Kategori' }
	];

	let mobileOpen = $state(false);
</script>

<header
	class="sticky top-0 z-40 border-b border-ink-900/10 bg-paper/80 backdrop-blur-md dark:border-white/10 dark:bg-ink-950/80"
>
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
		<a href="/" class="text-lg font-semibold tracking-tighter-heading text-ink-950 dark:text-white">
			nyated.
		</a>

		<div class="flex items-center gap-1">
			<nav class="hidden items-center gap-6 text-sm text-ink-600 md:flex dark:text-ink-200">
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

			<div class="mx-1 hidden h-5 w-px bg-ink-900/10 md:block dark:bg-white/10"></div>

			<ThemeToggle />

			<button
				type="button"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label="Buka menu"
				aria-expanded={mobileOpen}
				class="inline-flex size-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/5 md:hidden dark:text-ink-200 dark:hover:bg-white/10"
			>
				{#if mobileOpen}
					<X class="size-4" />
				{:else}
					<Menu class="size-4" />
				{/if}
			</button>
		</div>
	</div>

	{#if mobileOpen}
		<nav
			class="flex flex-col gap-1 border-t border-ink-900/10 px-4 py-3 text-sm text-ink-600 md:hidden dark:border-white/10 dark:text-ink-200"
		>
			{#each links as link (link.href)}
				<a
					href={link.href}
					onclick={() => (mobileOpen = false)}
					class="rounded-lg px-2 py-2 hover:bg-ink-900/5 dark:hover:bg-white/10"
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
