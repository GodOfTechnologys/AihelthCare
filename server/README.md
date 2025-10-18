# GlobalSmart Hub - Server

Local-first Express + Socket.IO backend with Prisma ORM (SQLite by default, Postgres optional).

## Scripts
- `npm run dev` - start dev server (port 5000)
- `npm run prisma:generate` - generate Prisma client for provider
- `npm run prisma:migrate -- <name>` - create/apply migration
- `npm run prisma:deploy` - deploy migrations (prod)
- `npm run seed` - seed database

## Environment
- `SERVER_DB_PROVIDER`: `sqlite` (default) or `postgres`
- `DATABASE_URL`: for sqlite use `file:./dev.db`; for postgres use a standard connection string
- `ALLOWED_ORIGIN`: http://localhost:3000
- `JWT_SECRET`: dev secret
- Optional: `USE_CLOUD`, `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `S3_*`

## Notes
- SQLite uses stringified JSON for `settings`, `metadata`, `payload`.
- Postgres uses JSON/JSONB natively.
