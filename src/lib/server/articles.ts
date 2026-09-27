import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/types';
import type { Article, ArticleListItem, ArticleStatus } from '$lib/types/article';
import { slugify, excerptFromMarkdown } from '$lib/utils/slug';

type DB = SupabaseClient<Database>;
type ArticleRow = Database['public']['Tables']['articles']['Row'];

const COLUMNS =
	'id, title, slug, content, excerpt, cover_image, tags, status, author_id, author_name, views, created_at, updated_at, published_at';

function rowToArticle(row: ArticleRow): Article {
	return {
		id: row.id,
		title: row.title,
		slug: row.slug,
		content: row.content,
		excerpt: row.excerpt,
		coverImage: row.cover_image,
		tags: row.tags ?? [],
		status: row.status,
		authorId: row.author_id ?? '',
		authorName: row.author_name,
		views: row.views,
		createdAt: new Date(row.created_at).getTime(),
		updatedAt: new Date(row.updated_at).getTime(),
		publishedAt: row.published_at ? new Date(row.published_at).getTime() : null
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
	supabase: DB,
	page = 1,
	perPage = 9,
	tag?: string
): Promise<PaginatedArticles> {
	const from = (page - 1) * perPage;
	const to = from + perPage - 1;

	let query = supabase
		.from('articles')
		.select(COLUMNS, { count: 'exact' })
		.eq('status', 'published')
		.order('published_at', { ascending: false, nullsFirst: false })
		.range(from, to);

	if (tag) query = query.contains('tags', [tag]);

	const { data, error, count } = await query;
	if (error) throw new Error(error.message);

	const total = count ?? 0;
	return {
		items: (data ?? []).map(rowToArticle),
		total,
		page,
		perPage,
		totalPages: Math.max(1, Math.ceil(total / perPage))
	};
}

export async function getArticleBySlug(supabase: DB, slug: string): Promise<Article | null> {
	const { data, error } = await supabase
		.from('articles')
		.select(COLUMNS)
		.eq('slug', slug)
		.eq('status', 'published')
		.maybeSingle();

	if (error) throw new Error(error.message);
	return data ? rowToArticle(data) : null;
}

export async function getRelatedArticles(
	supabase: DB,
	article: Article,
	max = 3
): Promise<ArticleListItem[]> {
	if (!article.tags.length) return [];

	const { data, error } = await supabase
		.from('articles')
		.select(COLUMNS)
		.eq('status', 'published')
		.overlaps('tags', article.tags)
		.neq('id', article.id)
		.limit(max);

	if (error) throw new Error(error.message);
	return (data ?? []).map(rowToArticle);
}

export async function getAllTags(supabase: DB): Promise<string[]> {
	const { data, error } = await supabase.from('articles').select('tags').eq('status', 'published');
	if (error) throw new Error(error.message);

	const tags = new Set<string>();
	(data ?? []).forEach((row) => (row.tags ?? []).forEach((t) => tags.add(t)));
	return Array.from(tags).sort();
}

export async function incrementArticleViews(supabase: DB, id: string): Promise<void> {
	const { error } = await supabase.rpc('increment_article_views', { p_article_id: id });
	if (error) console.error('Failed to record view', error.message);
}

// ---------- Admin CRUD ----------

export async function listAllArticles(supabase: DB): Promise<ArticleListItem[]> {
	const { data, error } = await supabase
		.from('articles')
		.select(COLUMNS)
		.order('updated_at', { ascending: false });

	if (error) throw new Error(error.message);
	return (data ?? []).map(rowToArticle);
}

export async function getArticleById(supabase: DB, id: string): Promise<Article | null> {
	const { data, error } = await supabase.from('articles').select(COLUMNS).eq('id', id).maybeSingle();
	if (error) throw new Error(error.message);
	return data ? rowToArticle(data) : null;
}

export interface ArticleInput {
	title: string;
	content: string;
	tags: string[];
	coverImage: string | null;
	status: ArticleStatus;
}

export async function createArticle(
	supabase: DB,
	input: ArticleInput,
	author: { id: string; email: string | null }
): Promise<string> {
	const baseSlug = slugify(input.title) || `artikel-${Date.now()}`;
	const slug = await ensureUniqueSlug(supabase, baseSlug);
	const now = new Date().toISOString();

	const { data, error } = await supabase
		.from('articles')
		.insert({
			title: input.title,
			slug,
			content: input.content,
			excerpt: excerptFromMarkdown(input.content),
			cover_image: input.coverImage,
			tags: input.tags,
			status: input.status,
			author_id: author.id,
			author_name: author.email ?? 'Admin',
			views: 0,
			created_at: now,
			updated_at: now,
			published_at: input.status === 'published' ? now : null
		})
		.select('id')
		.single();

	if (error) throw new Error(error.message);
	return data.id;
}

export async function updateArticle(supabase: DB, id: string, input: ArticleInput): Promise<void> {
	const existing = await getArticleById(supabase, id);
	if (!existing) throw new Error('Article not found');

	const newSlugBase = slugify(input.title);
	const slugChanged = newSlugBase && newSlugBase !== existing.slug;
	const slug = slugChanged ? await ensureUniqueSlug(supabase, newSlugBase, id) : existing.slug;

	const becamePublished = existing.status !== 'published' && input.status === 'published';
	const now = new Date().toISOString();

	const { error } = await supabase
		.from('articles')
		.update({
			title: input.title,
			slug,
			content: input.content,
			excerpt: excerptFromMarkdown(input.content),
			cover_image: input.coverImage,
			tags: input.tags,
			status: input.status,
			updated_at: now,
			...(becamePublished ? { published_at: now } : {})
		})
		.eq('id', id);

	if (error) throw new Error(error.message);
}

export async function deleteArticle(supabase: DB, id: string): Promise<void> {
	const { error } = await supabase.from('articles').delete().eq('id', id);
	if (error) throw new Error(error.message);
}

async function ensureUniqueSlug(supabase: DB, base: string, excludeId?: string): Promise<string> {
	let slug = base;
	let suffix = 1;

	while (true) {
		const { data, error } = await supabase.from('articles').select('id').eq('slug', slug).limit(2);
		if (error) throw new Error(error.message);

		const clash = (data ?? []).some((row) => row.id !== excludeId);
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

export async function getDashboardStats(supabase: DB): Promise<DashboardStats> {
	const all = await listAllArticles(supabase);
	const totalPublished = all.filter((a) => a.status === 'published').length;
	const totalDraft = all.filter((a) => a.status === 'draft').length;
	const totalViews = all.reduce((sum, a) => sum + (a.views ?? 0), 0);
	const topArticles = [...all].sort((a, b) => b.views - a.views).slice(0, 5);

	const { data, error } = await supabase
		.from('daily_stats')
		.select('date, views')
		.order('date', { ascending: false })
		.limit(14);

	if (error) throw new Error(error.message);
	const dailyViews = (data ?? []).map((d) => ({ date: d.date, views: d.views })).reverse();

	return { totalPublished, totalDraft, totalViews, topArticles, dailyViews };
}
