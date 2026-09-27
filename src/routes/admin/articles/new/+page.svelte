<script lang="ts">
	import ArticleForm from '$lib/components/ArticleForm.svelte';
</script>

<svelte:head>
	<title>Artikel baru — Admin</title>
</svelte:head>

<h1 class="mb-6 text-xl font-semibold tracking-tight text-ink-950 dark:text-white">Artikel baru</h1>

<ArticleForm submitLabel="Publikasikan" />
