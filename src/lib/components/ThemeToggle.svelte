<script lang="ts">
	import { browser } from '$app/environment';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';

	function currentIsDark() {
		if (!browser) return false;
		return document.documentElement.classList.contains('dark');
	}

	let isDark = $state(currentIsDark());

	function toggle() {
		const next = !isDark;
		isDark = next;
		document.documentElement.classList.toggle('dark', next);
		document.documentElement.classList.toggle('light', !next);
		try {
			localStorage.setItem('theme', next ? 'dark' : 'light');
		} catch {
			// storage unavailable (private mode, etc.) — theme just won't persist
		}
	}
</script>

<button
	type="button"
	onclick={toggle}
	aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
	class="inline-flex size-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-900/5 dark:text-ink-200 dark:hover:bg-white/10"
>
	{#if isDark}
		<Sun class="size-4" />
	{:else}
		<Moon class="size-4" />
	{/if}
</button>
