# Testing

## Scope
Questa base di test serve a verificare ANTICORES come prodotto reale, non una vecchia variante del portale. Le suite devono quindi seguire:

- lingua di default `en`
- review e admin accessibili solo a `research_admin` e `super_admin`
- `search` e `methodology` trattati come alias o redirect supportati
- validazione locale deterministica sulle porte approvate

## Suite disponibili
- `npm run test`
  Test unitari con Vitest su workflow, sicurezza, validation e utility.
- `npm run test:e2e`
  Playwright su discovery pubblica, auth base e workflow contributor -> review -> publish.
- `npm run test:browser-audit`
  Audit browser multi-viewport con screenshot e controlli di:
  - `pageError`
  - `console error`
  - overflow orizzontale
  - overflow a zoom `125%` e `150%`

## Baseline locale approvata
- app locale: `http://127.0.0.1:3210`
- db locale: `127.0.0.1:55432`
- il runtime production-like deve tenere `ATLAS_AUTO_SEED=false`
- verifica production-like consigliata:
  - `npm run build`
  - `npm run start`
  - smoke e browser audit puntati all URL esplicito

## Comandi
```bash
npm run lint
npm run typecheck
npm run test
npm run build
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3210 npm run test:e2e
REVIEW_BASE_URL=http://127.0.0.1:3210 npm run test:browser-audit
```

Per una verifica production-like usare lo stesso schema cambiando solo porta e processo:

```bash
PORT=3330 npm run start
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3330 npm run test:e2e
REVIEW_BASE_URL=http://127.0.0.1:3330 npm run test:browser-audit
```

## Acceptance minima
- `lint`, `typecheck`, `test`, `build` verdi
- `curl /api/health` e `curl /api/readiness` verdi sul target verificato
- suite E2E verde sul target esplicito
- browser audit senza crash, `pageError` o `console error` reali
- nessun overflow base sulle superfici core
- gli eventuali overflow residui a zoom alto devono essere documentati e non rompere task core
