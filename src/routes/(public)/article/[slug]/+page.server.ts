import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getArticleBySlug,
	getRelatedArticles,
	incrementArticleViews,
	getAllTags
} from '$lib/server/articles';
import { renderMarkdown } from '$lib/utils/markdown';

export const load: PageServerLoad = async ({ params, locals }) => {
	const article = await getArticleBySlug(locals.supabase, params.slug);

	if (!article) {
		throw error(404, 'Artikel tidak ditemukan');
	}

	// Fire-and-forget so the page doesn't wait on the write.
	incrementArticleViews(locals.supabase, article.id).catch((err) =>
		console.error('Failed to record view', err)
	);

	const [related, tags] = await Promise.all([
		getRelatedArticles(locals.supabase, article),
		getAllTags(locals.supabase)
	]);

	return {
		article,
		html: renderMarkdown(article.content),
		related,
		tags
	};
};
