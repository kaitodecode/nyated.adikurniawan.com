<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
	type Size = 'sm' | 'md' | 'lg';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		size?: Size;
		href?: string;
		class?: string;
		icon?: Snippet;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		class: className = '',
		icon,
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, string> = {
		primary:
			'border-ink-950 bg-ink-950 text-white hover:bg-ink-800 hover:border-ink-800 dark:border-white dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100 dark:hover:border-ink-100',
		secondary:
			'border-ink-900/15 bg-transparent text-ink-900 hover:bg-ink-900/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10',
		danger:
			'border-danger bg-danger text-white hover:bg-danger/90 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-500/90',
		ghost:
			'border-transparent bg-transparent text-ink-600 hover:bg-ink-900/5 dark:text-ink-200 dark:hover:bg-white/10'
	};

	const sizes: Record<Size, string> = {
		sm: 'px-3 py-1.5 text-xs gap-1.5',
		md: 'px-4 py-2 text-sm gap-2',
		lg: 'px-5 py-2.5 text-sm gap-2'
	};

	const base =
		'inline-flex items-center justify-center rounded-lg border font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50';
</script>

{#if href}
	<a {href} class="{base} {sizes[size]} {variants[variant]} {className}">
		{#if icon}{@render icon()}{/if}
		{@render children()}
	</a>
{:else}
	<button class="{base} {sizes[size]} {variants[variant]} {className}" {...rest}>
		{#if icon}{@render icon()}{/if}
		{@render children()}
	</button>
{/if}
