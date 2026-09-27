import type { PageServerLoad } from './$types';
import { getPublishedArticles } from '$lib/server/articles';

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1);
	const result = await getPublishedArticles(page, 9);

	return {
		...result
	};
};
