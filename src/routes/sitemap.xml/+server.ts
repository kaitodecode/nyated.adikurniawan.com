import type { RequestHandler } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { env } from '$env/dynamic/public';

export const GET: RequestHandler = async () => {
	const siteUrl = env.PUBLIC_SITE_URL ?? 'http://localhost:5173';

	const snapshot = await adminDb.collection('articles').where('status', '==', 'published').get();

	const urls = snapshot.docs.map((doc) => {
		const data = doc.data();
		const updatedAt = data.updatedAt?.toDate?.() ?? new Date();
		return `\t<url>\n\t\t<loc>${siteUrl}/article/${data.slug}</loc>\n\t\t<lastmod>${updatedAt
			.toISOString()
			.slice(0, 10)}</lastmod>\n\t</url>`;
	});

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\t<url>\n\t\t<loc>${siteUrl}/</loc>\n\t</url>\n${urls.join('\n')}\n</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
