import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getArticleById, updateArticle } from '$lib/server/articles';

export const load: PageServerLoad = async ({ params }) => {
	const article = await getArticleById(params.id);
	if (!article) throw error(404, 'Artikel tidak ditemukan');
	return { article };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });

		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const content = String(form.get('content') ?? '');
		const status = form.get('status') === 'published' ? 'published' : 'draft';
		const coverImage = String(form.get('coverImage') ?? '') || null;
		const tags = String(form.get('tags') ?? '')
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		if (!title) return fail(400, { error: 'Judul wajib diisi.' });
		if (!content.trim()) return fail(400, { error: 'Konten wajib diisi.' });

		await updateArticle(params.id, { title, content, tags, coverImage, status });
		throw redirect(303, `/admin/articles`);
	}
};
