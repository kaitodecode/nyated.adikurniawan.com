# nyated. — Self-hosted article CMS

Full-stack article/blog platform built with **SvelteKit** (SSR, self-hosted via `adapter-node`) and **Firebase** (Auth, Firestore, Storage).

## Stack

- **Frontend**: SvelteKit 2 + Svelte 5 (runes), Tailwind CSS v4, `marked` for Markdown rendering.
- **Auth**: Firebase Authentication (email/password) for a single-admin CMS. Any signed-in account is treated as admin — only create accounts for people you trust.
- **Data**: Firestore (`articles`, `dailyStats` collections) + Firebase Storage (cover images / in-content images).
- **Server**: SvelteKit server routes use the **Firebase Admin SDK** so public pages are fully server-rendered (SEO, no client-side Firestore reads needed).
- **Ads**: Google AdSense placeholder slots (sidebar, in-content, footer) — activate by setting `PUBLIC_ADSENSE_CLIENT_ID`.

## Project structure

```
src/
  routes/
    (public)/            # public site: article list, detail, categories
    admin/                # CMS: login, dashboard, article CRUD
    api/auth/session/     # session-cookie login/logout endpoint
    sitemap.xml, robots.txt
  lib/
    firebase/             # client SDK (auth, firestore, storage)
    server/                # firebase-admin SDK + article/session server logic
    components/            # ArticleCard, AdSlot, MarkdownEditor, LineChart, ...
    types/, utils/
functions/                # optional Cloud Functions (view increment, stats cleanup)
firestore.rules, storage.rules, firebase.json
```

## Setup

1. Create a Firebase project, then enable:
   - **Authentication** → Email/Password sign-in method (create at least one admin user).
   - **Firestore** (in native mode).
   - **Storage**.
2. Copy `.env.example` to `.env` and fill in:
   - `PUBLIC_FIREBASE_*` — from Project Settings → General → Your apps (Web app).
   - `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` — from Project Settings → Service Accounts → Generate new private key.
   - `PUBLIC_ADSENSE_CLIENT_ID` — optional, leave empty to show ad placeholders.
   - `PUBLIC_SITE_URL` — your production URL (used in sitemap/OG tags).
3. Deploy security rules and indexes:
   ```sh
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
4. Install dependencies and run:
   ```sh
   npm install
   npm run dev
   ```
5. Visit `/admin/login` and sign in with the admin account you created in step 1.

### Optional: Cloud Functions

`functions/` contains an optional `incrementViews` callable and a scheduled `dailyStatsCleanup` job. View counting already works out of the box via the SvelteKit server (`src/lib/server/articles.ts`), so deploying functions is only needed if you later serve the frontend as a static SPA without a Node backend.

```sh
cd functions && npm install && npm run deploy
```

## Building for self-hosting

```sh
npm run build
node build/index.js   # adapter-node output; configure PORT/ORIGIN as needed
```

## Notes

- Markdown is sanitized (`sanitize-html`) both server-side for the public article page and client-side (DOMPurify) for the editor's live preview.
- View counts increment server-side on each article page load and roll up into `dailyStats/{yyyy-mm-dd}` for the dashboard chart.
