export type ArticleStatus = 'draft' | 'published';

export interface Article {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	coverImage: string | null;
	tags: string[];
	status: ArticleStatus;
	authorId: string;
	authorName: string;
	views: number;
	createdAt: number;
	updatedAt: number;
	publishedAt: number | null;
}

export interface ArticleListItem
	extends Pick<
		Article,
		| 'id'
		| 'title'
		| 'slug'
		| 'excerpt'
		| 'coverImage'
		| 'tags'
		| 'status'
		| 'authorName'
		| 'views'
		| 'publishedAt'
		| 'createdAt'
	> {}

export interface DailyStat {
	date: string;
	views: number;
}
