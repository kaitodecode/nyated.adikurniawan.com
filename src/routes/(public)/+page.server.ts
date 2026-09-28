import type { PageServerLoad } from './$types';
import { getPublishedArticles, getAllTags } from '$lib/server/articles';

export const load: PageServerLoad = async ({ url, locals }) => {
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1);
	const [result, tags] = await Promise.all([
		getPublishedArticles(locals.supabase, page, 9),
		getAllTags(locals.supabase)
	]);

	return { ...result, tags };
};
