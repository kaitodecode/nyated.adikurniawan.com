<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<div
	class="rounded-xl border border-ink-900/10 bg-white p-5 dark:border-white/10 dark:bg-ink-900 {className}"
>
	{@render children()}
</div>
