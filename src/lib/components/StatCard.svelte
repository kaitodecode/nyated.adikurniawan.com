<script lang="ts">
	import type { Component } from 'svelte';
	import Card from '$lib/components/ui/Card.svelte';

	interface Props {
		label: string;
		value: string | number;
		icon?: Component<{ class?: string }>;
	}

	let { label, value, icon: Icon }: Props = $props();
</script>

<Card>
	<div class="flex items-start justify-between">
		<div>
			<p class="text-sm text-ink-500 dark:text-ink-400">{label}</p>
			<p class="mt-1 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
				{value}
			</p>
		</div>
		{#if Icon}
			<span
				class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent"
			>
				<Icon class="size-4.5" />
			</span>
		{/if}
	</div>
</Card>
