<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';

	const PUBLIC_ADSENSE_CLIENT_ID = env.PUBLIC_ADSENSE_CLIENT_ID ?? '';

	interface Props {
		slot?: string;
		format?: string;
		layout?: 'sidebar' | 'in-content' | 'footer';
		class?: string;
	}

	let { slot = '', format = 'auto', layout = 'in-content', class: className = '' }: Props = $props();

	const enabled = Boolean(PUBLIC_ADSENSE_CLIENT_ID);

	onMount(() => {
		if (!browser || !enabled) return;
		try {
			// @ts-expect-error adsbygoogle is injected by the AdSense script
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error('AdSense push failed', err);
		}
	});
</script>

{#if enabled}
	<div class="ad-slot ad-slot--{layout} {className}" aria-label="Iklan">
		<span class="mb-1 block text-center text-[10px] uppercase tracking-widest text-ink-500">
			Iklan
		</span>
		<ins
			class="adsbygoogle block"
			style="display:block"
			data-ad-client={PUBLIC_ADSENSE_CLIENT_ID}
			data-ad-slot={slot}
			data-ad-format={format}
			data-full-width-responsive="true"
		></ins>
	</div>
{:else}
	<!-- AdSense belum dikonfigurasi: isi PUBLIC_ADSENSE_CLIENT_ID pada .env untuk mengaktifkan slot ini -->
	<div
		class="ad-slot ad-slot--{layout} {className} flex items-center justify-center rounded-lg border border-dashed border-ink-500/30 bg-ink-500/5 p-6 text-xs text-ink-500"
	>
		Ad placeholder ({layout})
	</div>
{/if}
