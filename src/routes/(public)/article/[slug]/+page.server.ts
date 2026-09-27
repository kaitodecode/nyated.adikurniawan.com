import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getArticleBySlug, getRelatedArticles, incrementArticleViews } from '$lib/server/articles';
import { renderMarkdown } from '$lib/utils/markdown';

export const load: PageServerLoad = async ({ params }) => {
	const article = await getArticleBySlug(params.slug);

	if (!article) {
		throw error(404, 'Artikel tidak ditemukan');
	}

	// Fire-and-forget so the page doesn't wait on the write.
	incrementArticleViews(article.id).catch((err) => console.error('Failed to record view', err));

	const [related] = await Promise.all([getRelatedArticles(article)]);

	return {
		article,
		html: renderMarkdown(article.content),
		related
	};
};
