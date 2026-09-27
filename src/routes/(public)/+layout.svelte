<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { env } from '$env/dynamic/public';

	let { children } = $props();

	const adsenseClientId = env.PUBLIC_ADSENSE_CLIENT_ID ?? '';
</script>

<svelte:head>
	{#if adsenseClientId}
		<script
			async
			src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
