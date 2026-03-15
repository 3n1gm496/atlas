# ATLAS - Cartografia dinamica delle scritture digitali della moda

## Architettura scelta
- **Frontend + BFF**: Next.js App Router + TypeScript.
- **Data layer**: PostgreSQL con Prisma ORM e schema normalizzato per workflow editoriale/archivistico.
- **Styling**: Tailwind CSS con visual identity cartografico-editoriale.
- **Testing**: Vitest (unit) e Playwright (e2e scaffold).

## File tree
```text
app/
components/
lib/
prisma/
docs/
tests/
.github/workflows/
```

## Setup rapido
```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## Account demo
- admin@atlas.local
- editor@atlas.local
- contributor@atlas.local
(password hash demo-only)

## Comandi utili
```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```
