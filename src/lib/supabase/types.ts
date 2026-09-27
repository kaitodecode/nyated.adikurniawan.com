export interface Database {
	public: {
		Tables: {
			articles: {
				Row: {
					id: string;
					title: string;
					slug: string;
					content: string;
					excerpt: string;
					cover_image: string | null;
					tags: string[];
					status: 'draft' | 'published';
					author_id: string | null;
					author_name: string;
					views: number;
					created_at: string;
					updated_at: string;
					published_at: string | null;
				};
				Insert: Partial<Database['public']['Tables']['articles']['Row']> & {
					title: string;
					slug: string;
				};
				Update: Partial<Database['public']['Tables']['articles']['Row']>;
				Relationships: [];
			};
			daily_stats: {
				Row: { date: string; views: number };
				Insert: { date: string; views?: number };
				Update: { date?: string; views?: number };
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: {
			increment_article_views: {
				Args: { p_article_id: string };
				Returns: void;
			};
		};
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
}
