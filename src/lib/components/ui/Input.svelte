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
		<span class="mb-1.5 block text-ink-600 dark:text-ink-200">{label}</span>
	{/if}
	<input
		bind:value
		class="w-full rounded-lg border bg-white px-3 py-2 text-ink-900 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 dark:bg-ink-900 dark:text-white {error
			? 'border-danger focus:border-danger focus:ring-danger/20'
			: 'border-ink-900/15 dark:border-white/15'} {className}"
		{...rest}
	/>
	{#if hint && !error}
		<span class="mt-1 block text-xs text-ink-500 dark:text-ink-400">{hint}</span>
	{/if}
	{#if error}
		<span class="mt-1 block text-xs text-danger">{error}</span>
	{/if}
</label>
