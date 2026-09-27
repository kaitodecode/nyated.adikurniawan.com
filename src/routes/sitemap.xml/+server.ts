import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';

export const GET: RequestHandler = async ({ locals }) => {
	const siteUrl = env.PUBLIC_SITE_URL ?? 'http://localhost:5173';

	const { data, error } = await locals.supabase
		.from('articles')
		.select('slug, updated_at')
		.eq('status', 'published');

	if (error) throw error;

	const urls = (data ?? []).map(
		(row) =>
			`\t<url>\n\t\t<loc>${siteUrl}/article/${row.slug}</loc>\n\t\t<lastmod>${row.updated_at.slice(
				0,
				10
			)}</lastmod>\n\t</url>`
	);

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\t<url>\n\t\t<loc>${siteUrl}/</loc>\n\t</url>\n${urls.join('\n')}\n</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
