<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';

	interface Props {
		label: string;
		value: string | number;
	}

	let { label, value }: Props = $props();
</script>

<Card>
	<p class="text-sm text-ink-500 dark:text-white/50">{label}</p>
	<p class="mt-1 text-2xl font-semibold text-ink-950 dark:text-white">{value}</p>
</Card>
