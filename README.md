Kumo - Smart Content Explorer for anime
Browse, search, filter and bookmark anime from MyAnimeList via Jikan.

Stack
Frontend: Next.js App Router, React, CSS Modules
Backend: Node.js, Express, axios, node-cache
Data: Jikan public API v4, favorites in local JSON file

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
Set NEXT_PUBLIC_API_URL to backend URL

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
