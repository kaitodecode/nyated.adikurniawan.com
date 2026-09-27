import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';

export const GET: RequestHandler = async () => {
	const siteUrl = env.PUBLIC_SITE_URL ?? 'http://localhost:5173';
	const body = `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
