# Deployment

## Prerequisiti
- Node 20+
- PostgreSQL 16+
- Variabili ambiente obbligatorie:
  - `DATABASE_URL`
  - `NEXT_PUBLIC_APP_URL`
  - `NEXTAUTH_SECRET`
  - `APP_MODE`

## Passaggi
1. `npm ci`
2. `npm run prisma:generate`
3. `npx prisma migrate deploy`
4. `npm run prisma:seed` (solo ambienti staging o bootstrap locale)
5. `npm run build`
6. `npm run start`

## Healthcheck
- Endpoint: `/api/health`
- Usare come liveness probe.
- Endpoint: `/api/readiness`
- Usare come readiness probe.

## Hardening consigliato
- Reverse proxy con TLS terminazione.
- Header di sicurezza (CSP, HSTS, X-Frame-Options) a livello edge.
- Segreti via vault/secret manager.
- Storage S3-compatible per media in produzione.
- Logging applicativo raccolto come JSON strutturato.
- Error tracking e alerting su risposte `5xx`, readiness `503`, login failures e review failures.
- Rate limiting distribuito per register, login e submit prima del go-live pubblico.
