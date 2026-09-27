<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'flat' | 'interactive';
	type Padding = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant;
		padding?: Padding;
		class?: string;
		children: Snippet;
	}

	let { variant = 'flat', padding = 'md', class: className = '', children }: Props = $props();

	const paddings: Record<Padding, string> = {
		sm: 'p-4',
		md: 'p-5',
		lg: 'p-7'
	};

	const variants: Record<Variant, string> = {
		flat: '',
		interactive:
			'transition-all hover:-translate-y-0.5 hover:border-ink-900/20 hover:shadow-[0_4px_16px_-8px_rgba(15,17,21,0.15)] dark:hover:border-white/20'
	};
</script>

<div
	class="rounded-xl border border-ink-900/10 bg-white {paddings[padding]} {variants[
		variant
	]} dark:border-white/10 dark:bg-ink-900 {className}"
>
	{@render children()}
</div>
