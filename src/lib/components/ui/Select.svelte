<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props extends HTMLSelectAttributes {
		label?: string;
		class?: string;
		children: Snippet;
	}

	let { label, class: className = '', value = $bindable(), children, ...rest }: Props = $props();
</script>

<label class="block text-sm">
	{#if label}
		<span class="mb-1.5 block text-ink-600 dark:text-ink-200">{label}</span>
	{/if}
	<select
		bind:value
		class="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-ink-900 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/15 dark:bg-ink-900 dark:text-white {className}"
		{...rest}
	>
		{@render children()}
	</select>
</label>
