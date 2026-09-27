# nyated. — Self-hosted article CMS

Full-stack article/blog platform built with **SvelteKit** and **Supabase** (Auth, Postgres, Storage), deployed on **Cloudflare Workers**.

## Stack

- **Frontend**: SvelteKit 2 + Svelte 5 (runes), Tailwind CSS v4, `marked` for Markdown rendering.
- **Auth**: Supabase Auth (email/password) for a single-admin CMS. Any signed-in account is treated as admin — only create accounts for people you trust.
- **Data**: Supabase Postgres (`articles`, `daily_stats` tables, RLS-protected) + Supabase Storage (cover images / in-content images).
- **Deployment**: `@sveltejs/adapter-cloudflare` + `wrangler.jsonc` — everything (SSR pages + API routes) runs as a Cloudflare Worker, deployed via [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (Git-connected CI/CD). Supabase's client is REST/fetch-based, so it works natively on the Workers runtime (no Node-only APIs required, unlike `firebase-admin`/gRPC).
- **Ads**: Google AdSense placeholder slots (sidebar, in-content, footer) — activate by setting `PUBLIC_ADSENSE_CLIENT_ID`.

## Project structure

```
src/
  routes/
    (public)/            # public site: article list, detail, categories
    admin/                # CMS: login, dashboard, article CRUD
    sitemap.xml, robots.txt
  lib/
    supabase/             # browser client, storage upload helper, DB types
    server/                # per-request Supabase server client + article queries
    components/            # ArticleCard, AdSlot, MarkdownEditor, LineChart, ...
    types/, utils/
supabase/schema.sql        # tables, RLS policies, storage bucket + policies, view-count RPC
wrangler.jsonc              # Cloudflare Worker config (name, entry, static assets)
```

## Setup

1. Create a project at [supabase.com](https://supabase.com) (free tier is enough).
2. Open the SQL editor and run `supabase/schema.sql`. This creates:
   - `articles` and `daily_stats` tables with row-level security.
   - A public `article-images` storage bucket with read/write policies.
   - An `increment_article_views()` function so anonymous visitors can bump the view counter without direct table access.
3. In Authentication → Users, create at least one admin user (email/password).
4. Copy `.env.example` to `.env` and fill in:
   - `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` — from Project Settings → API.
   - `PUBLIC_ADSENSE_CLIENT_ID` — optional, leave empty to show ad placeholders.
   - `PUBLIC_SITE_URL` — your production URL (used in sitemap/OG tags).
5. Install dependencies and run:
   ```sh
   npm install
   npm run dev
   ```
6. Visit `/admin/login` and sign in with the admin account you created in step 3.

## Deploying to Cloudflare Workers

`wrangler.jsonc` at the repo root configures the Worker (name `nyated`, entry point, static assets directory, `nodejs_compat` flag). Two ways to deploy:

- **Workers Builds (Git-connected CI/CD)**: connect this repo in the Cloudflare dashboard under Workers & Pages → your worker → Settings → Builds. Build command `npm run build`; `wrangler.jsonc` tells it what to deploy — no extra build-output-directory setting needed.
- **Manual deploy**:
  ```sh
  npm run build
  npx wrangler deploy
  ```

Either way, add the environment variables from `.env` under your Worker's Settings → Variables (Production and, if used, Preview environments).

If any dependency ever complains about a missing Node API at runtime, `nodejs_compat` is already enabled in `wrangler.jsonc` — this project doesn't strictly need it today (all server-side deps are fetch/pure-JS), but it's there as a safety net.

## Notes

- All article reads/writes go through Supabase's Postgres RLS policies (see `supabase/schema.sql`) rather than a service-role key, so the same code path works identically in dev, in a Cloudflare Worker, and anywhere else.
- Markdown is sanitized (`sanitize-html`) server-side for the public article page, and client-side (DOMPurify) for the editor's live preview.
- View counts increment via the `increment_article_views` Postgres function (SECURITY DEFINER) on each article page load, and roll up into `daily_stats` for the dashboard chart.
