-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists articles (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	slug text not null unique,
	content text not null default '',
	excerpt text not null default '',
	cover_image text,
	tags text[] not null default '{}',
	status text not null default 'draft' check (status in ('draft', 'published')),
	author_id uuid references auth.users (id) on delete set null,
	author_name text not null default '',
	views integer not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	published_at timestamptz
);

create index if not exists articles_status_idx on articles (status);
create index if not exists articles_tags_idx on articles using gin (tags);
create index if not exists articles_slug_idx on articles (slug);

create table if not exists daily_stats (
	date date primary key,
	views integer not null default 0
);

alter table articles enable row level security;
alter table daily_stats enable row level security;

-- Single-admin CMS: any authenticated Supabase user is treated as admin.
-- Only create accounts for people you trust with full write access.

create policy "public_read_published_articles" on articles
	for select
	using (status = 'published');

create policy "admin_read_all_articles" on articles
	for select
	using (auth.role() = 'authenticated');

create policy "admin_insert_articles" on articles
	for insert
	with check (auth.role() = 'authenticated');

create policy "admin_update_articles" on articles
	for update
	using (auth.role() = 'authenticated');

create policy "admin_delete_articles" on articles
	for delete
	using (auth.role() = 'authenticated');

-- daily_stats is only ever touched through increment_article_views() below.
create policy "admin_read_daily_stats" on daily_stats
	for select
	using (auth.role() = 'authenticated');

-- Lets anonymous visitors bump the view counter without granting them
-- direct UPDATE access to the articles/daily_stats tables.
create or replace function increment_article_views(p_article_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
	v_status text;
begin
	select status into v_status from articles where id = p_article_id;

	if v_status is distinct from 'published' then
		return;
	end if;

	update articles set views = views + 1 where id = p_article_id;

	insert into daily_stats (date, views)
	values (current_date, 1)
	on conflict (date) do update set views = daily_stats.views + 1;
end;
$$;

grant execute on function increment_article_views(uuid) to anon, authenticated;

-- Storage: create a public bucket named "article-images" in the Supabase
-- dashboard (Storage -> New bucket -> Public), then run these policies.

insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

create policy "public_read_article_images" on storage.objects
	for select
	using (bucket_id = 'article-images');

create policy "admin_upload_article_images" on storage.objects
	for insert
	with check (
		bucket_id = 'article-images'
		and auth.role() = 'authenticated'
		and (storage.foldername(name))[1] = auth.uid()::text
	);

create policy "admin_manage_article_images" on storage.objects
	for update
	using (bucket_id = 'article-images' and auth.role() = 'authenticated');

create policy "admin_delete_article_images" on storage.objects
	for delete
	using (bucket_id = 'article-images' and auth.role() = 'authenticated');
