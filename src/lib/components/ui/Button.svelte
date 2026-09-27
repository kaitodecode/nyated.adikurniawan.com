<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		href?: string;
		class?: string;
		children: Snippet;
	}

	let { variant = 'primary', href, class: className = '', children, ...rest }: Props = $props();

	const variants: Record<Variant, string> = {
		primary:
			'border-ink-950 bg-ink-950 text-white hover:bg-transparent hover:text-ink-950 dark:border-white dark:bg-white dark:text-ink-950 dark:hover:bg-transparent dark:hover:text-white',
		secondary:
			'border-ink-900/15 bg-transparent text-ink-900 hover:bg-ink-900/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10',
		danger:
			'border-red-600 bg-red-600 text-white hover:bg-transparent hover:text-red-600 dark:border-red-500 dark:bg-red-500 dark:hover:bg-transparent dark:hover:text-red-400',
		ghost:
			'border-transparent bg-transparent text-ink-700 hover:bg-ink-900/5 dark:text-white/70 dark:hover:bg-white/10'
	};

	const base =
		'inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50';
</script>

{#if href}
	<a {href} class="{base} {variants[variant]} {className}">
		{@render children()}
	</a>
{:else}
	<button class="{base} {variants[variant]} {className}" {...rest}>
		{@render children()}
	</button>
{/if}
