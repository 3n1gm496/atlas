# ATLAS - Cartografia dinamica delle scritture digitali della moda

Piattaforma di ricerca e archivio partecipativo per mappare scritture digitali della moda con workflow contributor/editor/admin.

## Stack
- Next.js 14 (App Router) + TypeScript
- NextAuth v4 (credentials provider, JWT sessions)
- Tailwind CSS
- Prisma ORM + PostgreSQL
- bcryptjs (password hashing)
- Zod validation
- Vitest + Playwright

## Setup locale
```bash
cp .env.example .env
# Impostare NEXTAUTH_SECRET con una stringa casuale sicura
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## Docker Compose automatico
`docker compose up --build` ora:
- avvia PostgreSQL
- aspetta che il DB sia pronto
- applica automaticamente le migrazioni Prisma
- esegue il seed automatico solo se il database e vuoto

Quindi al primo avvio troverai gia utenti demo, tassonomie, entry, collezioni e dati per le dashboard.

## Account demo seed
| Email | Ruolo | Password |
|-------|-------|----------|
| `admin@atlas.local` | super_admin | `admin1234` |
| `editor@atlas.local` | editor | `editor1234` |
| `contributor@atlas.local` | contributor | `contributor1234` |
| `researcher@atlas.local` | research_admin | `researcher1234` |

## Autenticazione
- Login: gestito da NextAuth (`/api/auth/callback/credentials`)
- Registrazione: `POST /api/register`
- Le pagine `/account/*`, `/admin/*`, `/review/*` e `/submit/new` richiedono autenticazione
- La sessione è basata su JWT; il ruolo è salvato nel token

## API pronte per produzione (base)
- `GET /api/health`
- `GET/POST /api/entries`
- `GET/PATCH /api/entries/:id`
- `POST /api/submit`
- `GET /api/taxonomy/groups`
- `GET /api/analytics/overview`
- `POST /api/register`

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
