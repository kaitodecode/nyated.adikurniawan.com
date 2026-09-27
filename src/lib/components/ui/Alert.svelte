<script lang="ts">
	import type { Snippet } from 'svelte';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import Info from '@lucide/svelte/icons/info';

	type Tone = 'error' | 'success' | 'info';

	interface Props {
		tone?: Tone;
		class?: string;
		children: Snippet;
	}

	let { tone = 'error', class: className = '', children }: Props = $props();

	const tones: Record<Tone, string> = {
		error: 'bg-danger-muted text-danger',
		success: 'bg-success-muted text-success',
		info: 'bg-ink-900/5 text-ink-700 dark:bg-white/10 dark:text-ink-200'
	};

	const icons: Record<Tone, typeof CircleAlert> = {
		error: CircleAlert,
		success: CircleCheck,
		info: Info
	};

	let Icon = $derived(icons[tone]);
</script>

<div
	class="flex items-start gap-2 rounded-lg px-3 py-2 text-sm {tones[tone]} {className}"
	role="alert"
>
	<Icon class="mt-0.5 size-4 shrink-0" />
	<div>{@render children()}</div>
</div>
