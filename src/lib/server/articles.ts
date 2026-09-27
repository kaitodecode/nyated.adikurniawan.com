import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminDb } from './firebase-admin';
import type { Article, ArticleListItem } from '$lib/types/article';
import { slugify, excerptFromMarkdown } from '$lib/utils/slug';

const COLLECTION = 'articles';

function toMillis(value: unknown): number | null {
	if (value instanceof Timestamp) return value.toMillis();
	if (typeof value === 'number') return value;
	return null;
}

function docToArticle(doc: FirebaseFirestore.DocumentSnapshot): Article {
	const data = doc.data() ?? {};
	return {
		id: doc.id,
		title: data.title ?? '',
		slug: data.slug ?? doc.id,
		content: data.content ?? '',
		excerpt: data.excerpt ?? '',
		coverImage: data.coverImage ?? null,
		tags: data.tags ?? [],
		status: data.status ?? 'draft',
		authorId: data.authorId ?? '',
		authorName: data.authorName ?? '',
		views: data.views ?? 0,
		createdAt: toMillis(data.createdAt) ?? Date.now(),
		updatedAt: toMillis(data.updatedAt) ?? Date.now(),
		publishedAt: toMillis(data.publishedAt)
	};
}

export interface PaginatedArticles {
	items: ArticleListItem[];
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
}

export async function getPublishedArticles(
	page = 1,
	perPage = 9,
	tag?: string
): Promise<PaginatedArticles> {
	let query: FirebaseFirestore.Query = adminDb.collection(COLLECTION).where('status', '==', 'published');
	if (tag) query = query.where('tags', 'array-contains', tag);

	const snapshot = await query.get();
	const all = snapshot.docs
		.map(docToArticle)
		.sort((a, b) => (b.publishedAt ?? b.createdAt) - (a.publishedAt ?? a.createdAt));

	const total = all.length;
	const totalPages = Math.max(1, Math.ceil(total / perPage));
	const start = (page - 1) * perPage;
	const items = all.slice(start, start + perPage);

	return { items, total, page, perPage, totalPages };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
	const snapshot = await adminDb
		.collection(COLLECTION)
		.where('slug', '==', slug)
		.where('status', '==', 'published')
		.limit(1)
		.get();

	if (snapshot.empty) return null;
	return docToArticle(snapshot.docs[0]);
}

export async function getRelatedArticles(article: Article, max = 3): Promise<ArticleListItem[]> {
	if (!article.tags.length) return [];

	const snapshot = await adminDb
		.collection(COLLECTION)
		.where('status', '==', 'published')
		.where('tags', 'array-contains-any', article.tags.slice(0, 10))
		.limit(max + 1)
		.get();

	return snapshot.docs
		.map(docToArticle)
		.filter((a) => a.id !== article.id)
		.slice(0, max);
}

export async function getAllTags(): Promise<string[]> {
	const snapshot = await adminDb.collection(COLLECTION).where('status', '==', 'published').get();
	const tags = new Set<string>();
	snapshot.docs.forEach((doc) => {
		(doc.data().tags ?? []).forEach((t: string) => tags.add(t));
	});
	return Array.from(tags).sort();
}

export async function incrementArticleViews(id: string): Promise<void> {
	await adminDb
		.collection(COLLECTION)
		.doc(id)
		.update({ views: FieldValue.increment(1) });

	const today = new Date().toISOString().slice(0, 10);
	await adminDb
		.collection('dailyStats')
		.doc(today)
		.set({ views: FieldValue.increment(1), date: today }, { merge: true });
}

// ---------- Admin CRUD ----------

export async function listAllArticles(): Promise<ArticleListItem[]> {
	const snapshot = await adminDb.collection(COLLECTION).get();
	return snapshot.docs
		.map(docToArticle)
		.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getArticleById(id: string): Promise<Article | null> {
	const doc = await adminDb.collection(COLLECTION).doc(id).get();
	return doc.exists ? docToArticle(doc) : null;
}

export interface ArticleInput {
	title: string;
	content: string;
	tags: string[];
	coverImage: string | null;
	status: 'draft' | 'published';
}

export async function createArticle(
	input: ArticleInput,
	author: { uid: string; email: string | null }
): Promise<string> {
	const baseSlug = slugify(input.title) || `artikel-${Date.now()}`;
	const slug = await ensureUniqueSlug(baseSlug);
	const now = Timestamp.now();

	const docRef = await adminDb.collection(COLLECTION).add({
		title: input.title,
		slug,
		content: input.content,
		excerpt: excerptFromMarkdown(input.content),
		coverImage: input.coverImage,
		tags: input.tags,
		status: input.status,
		authorId: author.uid,
		authorName: author.email ?? 'Admin',
		views: 0,
		createdAt: now,
		updatedAt: now,
		publishedAt: input.status === 'published' ? now : null
	});

	return docRef.id;
}

export async function updateArticle(id: string, input: ArticleInput): Promise<void> {
	const existing = await getArticleById(id);
	if (!existing) throw new Error('Article not found');

	const slugChanged = slugify(input.title) !== existing.slug && slugify(existing.title) !== slugify(input.title);
	const slug = slugChanged ? await ensureUniqueSlug(slugify(input.title) || existing.slug, id) : existing.slug;

	const becamePublished = existing.status !== 'published' && input.status === 'published';

	await adminDb
		.collection(COLLECTION)
		.doc(id)
		.update({
			title: input.title,
			slug,
			content: input.content,
			excerpt: excerptFromMarkdown(input.content),
			coverImage: input.coverImage,
			tags: input.tags,
			status: input.status,
			updatedAt: Timestamp.now(),
			...(becamePublished ? { publishedAt: Timestamp.now() } : {})
		});
}

export async function deleteArticle(id: string): Promise<void> {
	await adminDb.collection(COLLECTION).doc(id).delete();
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
	let slug = base;
	let suffix = 1;

	while (true) {
		const snapshot = await adminDb.collection(COLLECTION).where('slug', '==', slug).limit(2).get();
		const clash = snapshot.docs.some((doc) => doc.id !== excludeId);
		if (!clash) return slug;
		suffix += 1;
		slug = `${base}-${suffix}`;
	}
}

// ---------- Dashboard stats ----------

export interface DashboardStats {
	totalPublished: number;
	totalDraft: number;
	totalViews: number;
	topArticles: ArticleListItem[];
	dailyViews: { date: string; views: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
	const all = await listAllArticles();
	const totalPublished = all.filter((a) => a.status === 'published').length;
	const totalDraft = all.filter((a) => a.status === 'draft').length;
	const totalViews = all.reduce((sum, a) => sum + (a.views ?? 0), 0);
	const topArticles = [...all].sort((a, b) => b.views - a.views).slice(0, 5);

	const statsSnapshot = await adminDb
		.collection('dailyStats')
		.orderBy('date', 'desc')
		.limit(14)
		.get();

	const dailyViews = statsSnapshot.docs
		.map((doc) => ({ date: doc.id, views: doc.data().views ?? 0 }))
		.reverse();

	return { totalPublished, totalDraft, totalViews, topArticles, dailyViews };
}
