import type { Actions, PageServerLoad } from './$types';
import { listAllArticles, deleteArticle } from '$lib/server/articles';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	return { articles: await listAllArticles(locals.supabase) };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const form = await request.formData();
		const id = form.get('id');

		if (typeof id !== 'string' || !id) {
			return fail(400, { error: 'Missing article id' });
		}

		await deleteArticle(locals.supabase, id);
		return { success: true };
	}
};
