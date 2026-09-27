import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';

initializeApp();
const db = getFirestore();

/**
 * Optional alternative to incrementing views from the SvelteKit server:
 * useful if the frontend is ever deployed as a static SPA without a Node backend.
 */
export const incrementViews = onCall(async (request) => {
	const articleId = request.data?.articleId;
	if (typeof articleId !== 'string' || !articleId) {
		throw new HttpsError('invalid-argument', 'articleId is required');
	}

	const articleRef = db.collection('articles').doc(articleId);
	const article = await articleRef.get();
	if (!article.exists || article.data()?.status !== 'published') {
		throw new HttpsError('not-found', 'Article not found');
	}

	await articleRef.update({ views: FieldValue.increment(1) });

	const today = new Date().toISOString().slice(0, 10);
	await db
		.collection('dailyStats')
		.doc(today)
		.set({ views: FieldValue.increment(1), date: today }, { merge: true });

	return { ok: true };
});

/**
 * Prunes dailyStats older than 90 days so the collection stays small.
 */
export const dailyStatsCleanup = onSchedule('every 24 hours', async () => {
	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - 90);
	const cutoffKey = cutoff.toISOString().slice(0, 10);

	const snapshot = await db.collection('dailyStats').where('date', '<', cutoffKey).get();
	const batch = db.batch();
	snapshot.docs.forEach((doc) => batch.delete(doc.ref));
	await batch.commit();
});
