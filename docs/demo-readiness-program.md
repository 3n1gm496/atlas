# Readiness Program

This is the canonical checklist for deciding whether ATLAS is ready for an official sign-off.

## Goal

Reach a single operator decision:

- `GO` only when the project is stable enough to present live without caveats.
- `NO-GO` if any gate fails, with a concrete blocker list.

The target is a **production-like runtime**, not `next dev`.

## Baseline

- App baseline for local verification: `http://127.0.0.1:3210`
- Production-like rehearsal baseline: `http://127.0.0.1:3330`
- Local PostgreSQL baseline: `127.0.0.1:55432`
- Seed data must be the real dataset already tracked in the repo
- Public exposure, if needed, is temporary and only after local gates are green

## Gate 1: Code and schema health

Run these in order:

```bash
npm run prisma:doctor
npm run test
npm run typecheck
npm run lint
npm run build
```

Exit criteria:

- all commands pass
- no stale Prisma client/schema drift
- no ignored build or type warnings

## Gate 2: Runtime health

Verify both local and production-like targets:

```bash
curl -sSf http://127.0.0.1:3210/api/health
curl -sSf http://127.0.0.1:3210/api/readiness
curl -sSf http://127.0.0.1:3330/api/health
curl -sSf http://127.0.0.1:3330/api/readiness
```

Exit criteria:

- health returns `200`
- readiness returns `200`
- app mode and env align with the chosen target
- no automatic seed is happening in the runtime
- readiness reports dataset health with `rowsRenderableWithEditorialFallback == rowsTotal`
- readiness reports `rowsWithCanonicalCollision == 0` and `orphanAssets == 0`
- readiness fails if `ATLAS_AUTO_SEED` is enabled

## Gate 3: Browser verification

Run the browser suites against both targets:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3210 npm run test:e2e
REVIEW_BASE_URL=http://127.0.0.1:3210 npm run test:browser-audit
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3330 npm run test:e2e
REVIEW_BASE_URL=http://127.0.0.1:3330 npm run test:browser-audit
```

Exit criteria:

- homepage is reachable
- archive and map render
- login works
- contributor submit works
- review/admin routes are role-gated correctly
- browser audit has no real `pageError` or `console error`
- no blocking overflow on core screens
- no critical route depends on hidden synthetic content

## Gate 4: Sign-Off Smoke

Before sign-off, exercise the exact user path a presenter will click:

- homepage
- archive
- map
- a real entry detail page
- login
- register
- contributor submit
- review
- admin media
- admin analytics
- admin audit
- admin settings

Exit criteria:

- the real dataset is visible on the public surfaces
- media assets render correctly
- taxonomy and metadata are consistent with the workbook data
- sparse workbook rows use explicit editorial fallback instead of blank cards
- authentication and role separation behave as documented

## Gate 5: Operational readiness

Required before a live sign-off:

- `APP_MODE=production` or a clearly documented staging equivalent
- `ATLAS_AUTO_SEED=false`
- `NEXTAUTH_SECRET` is non-default and externally managed
- `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` match the actual target
- database backup exists
- rollback owner is named
- rollback steps are known and testable

## Failures

If any gate fails:

1. Stop.
2. Record the exact command, route, and error.
3. Fix the blocker.
4. Re-run the gates from the top of the failed layer.

Do not mark the system ready by relying on manual confidence alone.

## Decision

The project is ready only when all gates are green on the chosen target and the rollback path is ready.
