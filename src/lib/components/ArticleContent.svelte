<script lang="ts">
	import AdSlot from './AdSlot.svelte';

	interface Props {
		html: string;
		insertAdAfterBlock?: number;
	}

	let { html, insertAdAfterBlock = 3 }: Props = $props();

	// Split on top-level closing block tags so we can slip an in-content ad
	// between paragraphs without touching the sanitized markup itself.
	function splitBlocks(source: string): string[] {
		const parts = source.split(/(<\/(?:p|h2|h3|blockquote|ul|ol|pre)>)/i);
		const blocks: string[] = [];
		for (let i = 0; i < parts.length; i += 2) {
			const chunk = (parts[i] ?? '') + (parts[i + 1] ?? '');
			if (chunk.trim()) blocks.push(chunk);
		}
		return blocks;
	}

	let blocks = $derived(splitBlocks(html));
</script>

<div
	class="prose prose-article prose-neutral max-w-none prose-headings:font-semibold prose-a:text-accent dark:prose-invert"
>
	{#each blocks as block, i (i)}
		{@html block}
		{#if i === insertAdAfterBlock - 1 && blocks.length > insertAdAfterBlock}
			<div class="not-prose my-8">
				<AdSlot layout="in-content" />
			</div>
		{/if}
	{/each}
</div>
