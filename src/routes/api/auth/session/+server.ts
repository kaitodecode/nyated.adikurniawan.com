import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminAuth } from '$lib/server/firebase-admin';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { idToken } = await request.json();

	if (!idToken) {
		return json({ error: 'Missing idToken' }, { status: 400 });
	}

	try {
		// Reject the request if the token is too old or the user isn't an admin.
		const decoded = await adminAuth.verifyIdToken(idToken, true);

		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn: SESSION_MAX_AGE_MS
		});

		cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: SESSION_MAX_AGE_MS / 1000
		});

		return json({ uid: decoded.uid });
	} catch (err) {
		console.error('Failed to create session', err);
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
	return json({ ok: true });
};
