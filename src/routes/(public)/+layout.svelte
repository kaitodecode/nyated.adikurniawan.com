<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { PUBLIC_ADSENSE_CLIENT_ID } from '$env/static/public';

	let { children } = $props();
</script>

<svelte:head>
	{#if PUBLIC_ADSENSE_CLIENT_ID}
		<script
			async
			src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLIC_ADSENSE_CLIENT_ID}`}
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
