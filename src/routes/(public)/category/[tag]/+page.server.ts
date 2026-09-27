import type { PageServerLoad } from './$types';
import { getPublishedArticles } from '$lib/server/articles';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1);
	const result = await getPublishedArticles(locals.supabase, page, 9, params.tag);

	return { ...result, tag: params.tag };
};
