<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

	interface Props {
		tone?: Tone;
		href?: string;
		class?: string;
		children: Snippet;
	}

	let { tone = 'neutral', href, class: className = '', children }: Props = $props();

	const tones: Record<Tone, string> = {
		neutral:
			'bg-ink-900/5 text-ink-700 hover:bg-ink-900/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15',
		success: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
		warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
		danger: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
		accent: 'bg-accent/10 text-accent dark:bg-accent/20'
	};

	const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition';
</script>

{#if href}
	<a {href} class="{base} {tones[tone]} {className}">{@render children()}</a>
{:else}
	<span class="{base} {tones[tone]} {className}">{@render children()}</span>
{/if}
