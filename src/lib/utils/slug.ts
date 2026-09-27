export function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

export function excerptFromMarkdown(markdown: string, length = 160): string {
	const plain = markdown
		.replace(/!\[[^\]]*]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
		.replace(/[#*_>`~\-]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	return plain.length > length ? `${plain.slice(0, length).trim()}…` : plain;
}
