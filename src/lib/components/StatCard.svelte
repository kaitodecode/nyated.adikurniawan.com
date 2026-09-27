<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
	}

	let { label, value }: Props = $props();
</script>

<div class="rounded-xl border border-ink-900/10 bg-white p-5">
	<p class="text-sm text-ink-500">{label}</p>
	<p class="mt-1 text-2xl font-semibold text-ink-950">{value}</p>
</div>
