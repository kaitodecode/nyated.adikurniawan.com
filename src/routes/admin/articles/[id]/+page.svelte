<script lang="ts">
	import ArticleForm from '$lib/components/ArticleForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Edit: {data.article.title} — Admin</title>
</svelte:head>

<h1 class="mb-6 text-xl font-semibold tracking-tight text-ink-950 dark:text-white">Edit artikel</h1>

<ArticleForm
	initial={{
		title: data.article.title,
		content: data.article.content,
		tags: data.article.tags,
		coverImage: data.article.coverImage,
		status: data.article.status
	}}
	submitLabel="Simpan perubahan"
/>
