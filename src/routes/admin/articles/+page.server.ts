import type { Actions, PageServerLoad } from './$types';
import { listAllArticles, deleteArticle } from '$lib/server/articles';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return { articles: await listAllArticles() };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id');

		if (typeof id !== 'string' || !id) {
			return fail(400, { error: 'Missing article id' });
		}

		await deleteArticle(id);
		return { success: true };
	}
};
