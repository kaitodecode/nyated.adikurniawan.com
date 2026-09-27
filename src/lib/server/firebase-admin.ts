import { getApps, getApp, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from '$env/dynamic/private';

function createAdminApp(): App {
	if (getApps().length) return getApp();

	const projectId = env.FIREBASE_PROJECT_ID;
	const clientEmail = env.FIREBASE_CLIENT_EMAIL;
	// Support both a literal \n-escaped key (common in .env files) and a raw one.
	const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

	if (!projectId || !clientEmail || !privateKey) {
		throw new Error(
			'Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.'
		);
	}

	return initializeApp({
		credential: cert({ projectId, clientEmail, privateKey })
	});
}

export const adminApp = createAdminApp();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
