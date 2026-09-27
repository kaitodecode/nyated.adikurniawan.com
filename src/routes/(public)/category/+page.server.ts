import type { PageServerLoad } from './$types';
import { getAllTags } from '$lib/server/articles';

export const load: PageServerLoad = async () => {
	return { tags: await getAllTags() };
};
