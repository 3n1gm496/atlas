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
npm run prisma:doctor
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## Bootstrap locale rapido
Per avviarlo davvero sulla tua macchina con PostgreSQL in Docker e il dataset reale:

```bash
npm run bootstrap:local
PORT=3210 env $(grep -v '^#' .env.local | xargs) npm run dev
```

Questo bootstrap:
- avvia un PostgreSQL locale dedicato su `55432`
- scrive `.env.local`
- esegue `prisma generate`
- applica le migrazioni
- carica i dati del workbook sincronizzato

## Docker Compose automatico
`docker compose up --build` ora:
- avvia PostgreSQL
- aspetta che il DB sia pronto
- applica automaticamente le migrazioni Prisma
- non esegue seed automatico nel runtime di produzione-like

Per caricare il dataset sincronizzato usa `npm run bootstrap:local` oppure un seed esplicito prima di avviare il runtime.

Runtime locale approvato:
- app `http://127.0.0.1:3210`
- db `127.0.0.1:55432`

Quindi al primo avvio troverai gia utenti, tassonomie, entry, collezioni e dati per le dashboard.

## Account seed
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
- `GET /api/readiness`
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

## Prisma sync
```bash
npm run prisma:doctor
```
Se fallisce, il client Prisma generato non e allineato con `prisma/schema.prisma` e va rigenerato prima di toccare workflow o schema.

## Docker
```bash
docker compose up --build
```

## Note go-live
- In produzione impostare sempre `APP_MODE=production` oppure `APP_MODE=staging`
- In produzione `NEXTAUTH_SECRET` deve essere fornito via secret manager o variabile ambiente esterna
- Usare `/api/health` come liveness probe
- Usare `/api/readiness` come readiness probe
- Eseguire `npx prisma migrate deploy` prima dello start applicativo

## Demo readiness
Il programma canonico per decidere se ATLAS e pronto per una demo ufficiale e `docs/demo-readiness-program.md`.

I riferimenti operativi restano disponibili qui:
- checklist esecutiva: `docs/production-checklist.md`
- runbook operativo: `docs/go-live-runbook.md`
- readiness di produzione: `docs/production-readiness.md`
