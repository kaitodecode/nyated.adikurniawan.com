<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label?: string;
		hint?: string;
		error?: string;
		class?: string;
	}

	let {
		label,
		hint,
		error,
		class: className = '',
		value = $bindable(),
		...rest
	}: Props = $props();
</script>

<label class="block text-sm">
	{#if label}
		<span class="mb-1 block text-ink-700 dark:text-white/70">{label}</span>
	{/if}
	<input
		bind:value
		class="w-full rounded-md border bg-white px-3 py-2 text-ink-900 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30 dark:bg-ink-900 dark:text-white {error
			? 'border-red-400 dark:border-red-500'
			: 'border-ink-900/15 dark:border-white/15'} {className}"
		{...rest}
	/>
	{#if hint && !error}
		<span class="mt-1 block text-xs text-ink-500 dark:text-white/50">{hint}</span>
	{/if}
	{#if error}
		<span class="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>
	{/if}
</label>
