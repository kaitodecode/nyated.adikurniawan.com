<script lang="ts">
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import ThemeToggle from './ThemeToggle.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import Home from '@lucide/svelte/icons/house';
	import Tags from '@lucide/svelte/icons/tags';
	import NotebookPen from '@lucide/svelte/icons/notebook-pen';

	const links = [
		{ href: '/', label: 'Beranda', icon: Home },
		{ href: '/category', label: 'Kategori', icon: Tags }
	];

	let mobileOpen = $state(false);
</script>

<header
	class="sticky top-0 z-40 border-b border-ink-900/10 bg-paper/80 backdrop-blur-md dark:border-white/10 dark:bg-ink-950/80"
>
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
		<a
			href="/"
			class="group flex items-center gap-1.5 text-lg font-semibold tracking-tighter-heading text-ink-950 dark:text-white"
		>
			<NotebookPen
				class="size-4.5 text-accent transition-transform duration-300 group-hover:-rotate-6"
			/>
			nyated<span class="text-accent">.</span>
		</a>

		<div class="flex items-center gap-1">
			<nav class="hidden items-center gap-1 text-sm text-ink-600 md:flex dark:text-ink-200">
				{#each links as link (link.href)}
					{@const active = page.url.pathname === link.href}
					<a
						href={link.href}
						class="group relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors hover:bg-ink-900/5 dark:hover:bg-white/10"
						class:text-ink-950={active}
						class:dark:text-white={active}
						class:font-medium={active}
					>
						<link.icon class="size-3.5" />
						{link.label}
						<span
							class="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-200 ease-out group-hover:scale-x-100"
							class:scale-x-100={active}
						></span>
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
			transition:slide={{ duration: 180 }}
			class="flex flex-col gap-1 border-t border-ink-900/10 px-4 py-3 text-sm text-ink-600 md:hidden dark:border-white/10 dark:text-ink-200"
		>
			{#each links as link (link.href)}
				{@const active = page.url.pathname === link.href}
				<a
					href={link.href}
					onclick={() => (mobileOpen = false)}
					class="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-ink-900/5 dark:hover:bg-white/10"
					class:bg-accent-muted={active}
					class:text-accent={active}
					class:font-medium={active}
				>
					<link.icon class="size-4" />
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>
