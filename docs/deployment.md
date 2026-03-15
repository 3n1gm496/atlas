# Deployment

## Prerequisiti
- Node 20+
- PostgreSQL 16+
- Variabili ambiente obbligatorie:
  - `DATABASE_URL`
  - `NEXT_PUBLIC_APP_URL`

## Passaggi
1. `npm ci`
2. `npm run prisma:generate`
3. `npx prisma migrate deploy`
4. `npm run prisma:seed` (solo ambienti demo/staging)
5. `npm run build`
6. `npm run start`

## Healthcheck
- Endpoint: `/api/health`
- Usare per readiness/liveness probes.

## Hardening consigliato
- Reverse proxy con TLS terminazione.
- Header di sicurezza (CSP, HSTS, X-Frame-Options) a livello edge.
- Segreti via vault/secret manager.
- Storage S3-compatible per media in produzione.
