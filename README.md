# GlobalSmart Hub — Full-Stack Real-Time AI Platform

Run locally (offline-first) with SQLite + Socket.IO. Optionally enable cloud (Postgres, Supabase, OpenAI, S3).

## Quickstart (Local)
1. Copy env: `cp .env.example .env`
2. Start DB + server + client via Docker: `docker-compose up --build`
   - Server: http://localhost:5000
   - Client: http://localhost:3000

Or run manually:
- Server
  - `cd server`
  - `npm install`
  - `DATABASE_URL='file:./dev.db' npm run prisma:migrate -- init`
  - `npm run dev` (port 5000)
- Client
  - `cd client`
  - `npm install`
  - `npm run dev` (port 3000)

Demo login: `alice@example.com` / `password123`.

## Features
- Offline-first: SQLite, Socket.IO, local rule-based AI
- Online mode: Postgres, Supabase Realtime, OpenAI, S3-compatible storage
- Real-time chat, analytics, notifications, file upload
- Accessible UI with dark/light toggle, charts, mobile-first

## Cloud Config
Set in `.env`:
- `SERVER_DB_PROVIDER=postgres`
- `DATABASE_URL=postgresql://...`
- `USE_CLOUD=true` plus `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `S3_*`

## Docs
- API docs: `/api/docs`
- Sync strategy: `docs/sync.md`
