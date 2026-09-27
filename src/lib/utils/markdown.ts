import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

marked.setOptions({ gfm: true, breaks: false });

const ALLOWED_TAGS = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'p',
	'a',
	'ul',
	'ol',
	'li',
	'blockquote',
	'pre',
	'code',
	'em',
	'strong',
	'del',
	'hr',
	'br',
	'img',
	'table',
	'thead',
	'tbody',
	'tr',
	'th',
	'td',
	'figure',
	'figcaption',
	'span'
];

export function renderMarkdown(markdown: string): string {
	const rawHtml = marked.parse(markdown ?? '', { async: false }) as string;

	return sanitizeHtml(rawHtml, {
		allowedTags: ALLOWED_TAGS,
		allowedAttributes: {
			a: ['href', 'name', 'target', 'rel'],
			img: ['src', 'alt', 'title', 'loading'],
			code: ['class'],
			pre: ['class'],
			span: ['class']
		},
		allowedSchemes: ['http', 'https', 'mailto'],
		transformTags: {
			a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer nofollow' })
		}
	});
}
