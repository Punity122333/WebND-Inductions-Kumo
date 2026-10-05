Kumo - Smart Content Explorer for anime
Browse, search, filter and bookmark anime. The frontend talks only to
the Express backend, which fetches data from AniList and caches it.

Stack
Frontend: Next.js App Router, React, CSS Modules
Backend: Node.js, Express, axios, node-cache
Data: AniList GraphQL API (https://docs.anilist.co)
Favorites are stored in a local JSON file on the backend.

Features
Debounced title search with shareable URLs
Genre, type, status and minimum score filters with sorting
Pagination, genre chips and a trending home view
Detail pages with trailer, characters and recommendations
Favorites with optimistic updates and a count badge
Skeletons for loading and retry buttons for errors

Run backend
cd backend
npm install
cp .env.example .env
npm run dev
Backend runs on http://localhost:5000

Run frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
Frontend runs on http://localhost:3000
Set NEXT_PUBLIC_API_URL to the backend URL with no trailing slash

API endpoints
GET /api/anime/search?q,page,genre,type,status,minScore,orderBy,sort,limit
GET /api/anime/top?page
GET /api/anime/genres
GET /api/anime/:id
GET /api/anime/:id/characters
GET /api/anime/:id/recommendations
GET /api/favorites
POST /api/favorites
DELETE /api/favorites/:id
GET /health

Deployment
Backend runs on Render. Set ANILIST_URL=https://graphql.anilist.co,
CACHE_TTL_SECONDS=600 and FRONTEND_ORIGIN to the deployed frontend URL.
PORT is assigned by the host, so leave it unset.
Frontend runs on Vercel. Set NEXT_PUBLIC_API_URL to the backend URL
with no trailing slash.
JIKAN_BASE_URL is no longer used. Remove it from Render and from any
local .env file.

Rate limits
AniList allows roughly 90 requests per minute and may throttle lower.
The backend caches responses for 10 minutes and queues requests so the
app rarely hits the limit. If a 429 error still appears, wait about a
minute and press Try again.

Why AniList and not Jikan
The public Jikan API was shut down in October 2026, so the data source
was moved to the AniList GraphQL API. The backend keeps the same
endpoints and response shapes, which is why the frontend did not need
a rewrite.
