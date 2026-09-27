import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createArticle } from '$lib/server/articles';

export const actions: Actions = {
	default: async ({ request, locals }) => {
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

		const id = await createArticle(
			locals.supabase,
			{ title, content, tags, coverImage, status },
			{ id: locals.user.id, email: locals.user.email ?? null }
		);
		throw redirect(303, `/admin/articles/${id}`);
	}
};
