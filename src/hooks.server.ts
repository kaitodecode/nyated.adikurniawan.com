import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;

	const sessionCookie = event.cookies.get(SESSION_COOKIE_NAME);

	if (sessionCookie) {
		try {
			const { adminAuth } = await import('$lib/server/firebase-admin');
			const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
			event.locals.user = { uid: decoded.uid, email: decoded.email ?? null };
		} catch {
			event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		}
	}

	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const isLoginRoute = event.url.pathname === '/admin/login';

	if (isAdminRoute && !isLoginRoute && !event.locals.user) {
		throw redirect(303, `/admin/login?next=${encodeURIComponent(event.url.pathname)}`);
	}

	if (isLoginRoute && event.locals.user) {
		throw redirect(303, '/admin/dashboard');
	}

	return resolve(event);
};
