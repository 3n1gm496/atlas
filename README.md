# ATLAS - Cartografia dinamica delle scritture digitali della moda

Piattaforma di ricerca e archivio partecipativo per mappare scritture digitali della moda con workflow contributor/editor/admin.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- Zod validation
- Vitest + Playwright

## Setup locale
```bash
cp .env.example .env
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## Account demo seed
- `admin@atlas.local`
- `editor@atlas.local`
- `contributor@atlas.local`

## API pronte per produzione (base)
- `GET /api/health`
- `GET/POST /api/entries`
- `GET/PATCH /api/entries/:id`
- `POST /api/submit`
- `GET /api/taxonomy/groups`
- `GET /api/analytics/overview`

> Le route sensibili applicano RBAC via header `x-atlas-role` (adapter iniziale, da collegare all’auth provider definitivo in fase hardening).

## Comandi qualità
```bash
npm run typecheck
npm run test
npm run build
```

## Docker
```bash
docker compose up --build
```

## Stato produzione
Vedi checklist dettagliata: `docs/production-readiness.md`.
