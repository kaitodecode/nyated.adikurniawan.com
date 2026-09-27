<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'error' | 'success' | 'info';

	interface Props {
		tone?: Tone;
		class?: string;
		children: Snippet;
	}

	let { tone = 'error', class: className = '', children }: Props = $props();

	const tones: Record<Tone, string> = {
		error: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
		success: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
		info: 'bg-ink-900/5 text-ink-700 dark:bg-white/10 dark:text-white/70'
	};
</script>

<div class="rounded-md px-3 py-2 text-sm {tones[tone]} {className}" role="alert">
	{@render children()}
</div>
