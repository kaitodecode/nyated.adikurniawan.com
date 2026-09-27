import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdownPreview(markdown: string): string {
	const rawHtml = marked.parse(markdown ?? '', { async: false }) as string;
	return DOMPurify.sanitize(rawHtml);
}
