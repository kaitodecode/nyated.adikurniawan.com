import type { PageServerLoad } from './$types';
import { getDashboardStats } from '$lib/server/articles';

export const load: PageServerLoad = async () => {
	return { stats: await getDashboardStats() };
};
