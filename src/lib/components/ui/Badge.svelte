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
			'bg-ink-900/5 text-ink-600 hover:bg-ink-900/10 dark:bg-white/10 dark:text-ink-200 dark:hover:bg-white/15',
		success: 'bg-success-muted text-success',
		warning: 'bg-warning-muted text-warning',
		danger: 'bg-danger-muted text-danger',
		accent: 'bg-accent-muted text-accent'
	};

	const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition';
</script>

{#if href}
	<a {href} class="{base} {tones[tone]} {className}">{@render children()}</a>
{:else}
	<span class="{base} {tones[tone]} {className}">{@render children()}</span>
{/if}
