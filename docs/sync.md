# Sync Strategy (Offline ⇄ Online)

GlobalSmart Hub maintains an offline-first database and an optional cloud database. The system performs near real-time two-way synchronization with conflict resolution.

## Entities
- users
- messages
- analytics_logs
- notifications
- settings

## Identifiers
- Each record uses a stable UUID (or numeric id) and a `updated_at` timestamp.
- For offline-first, clients generate IDs locally. On merge, IDs are preserved.

## Conflict Resolution
- Per-entity Last-Write-Wins using `updated_at` for simple fields.
- For messages, conflicts are rare; prefer the newer `updated_at`.
- For settings, merge object fields shallowly by key and prefer newer values.
- For analytics logs, records are append-only; no conflict.

## Sync Flow
1. Client batches local changes with their `updated_at` and `origin` (client id).
2. Server validates, applies to local DB, emits `sync:apply` via realtime.
3. Server optionally replicates to cloud DB when `USE_CLOUD=true`.
4. On connectivity regain, client requests `sync:request` with last sync cursor.
5. Server responds with changed records since cursor for each table.

## Cursors
- Maintain per-table high-watermark using `updated_at` and `id` tie-breaker.

## Failure Handling
- Idempotent upserts.
- Retries with exponential backoff.
- Dead letter queue for irreconcilable records (server logs + admin review).

## Security
- Authenticated sync endpoints; JWT scopes.
- Input validation and size limits.
