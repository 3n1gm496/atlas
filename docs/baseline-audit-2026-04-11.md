# Baseline Audit - 2026-04-11

## Stato attuale
- UI pubblica, contributor, review e admin sono gia state rifondate in modo sostanziale.
- Il repo ha una worktree ampia e viva: prima di ulteriori salti architetturali va trattato come baseline da consolidare.
- La suite minima di qualita esiste gia: `typecheck`, `lint`, `build`, Vitest, Playwright, browser audit.
- Il bootstrap locale con PostgreSQL dedicato e la readiness tecnica sono gia presenti.

## Miglioramenti chiusi in questa tranche
- Contributor flow con autosave locale e resume automatico del wizard di nuova scheda.
- Scheda pubblica con cronologia leggibile della vita editoriale del materiale.
- Audit scritto della baseline per separare chiaramente stato corrente e prossimi epic.

## Gap prioritari ancora aperti
- Resume e autosave persistente lato server per bozze lunghe e multi-dispositivo.
- Review workspace con note ancora piu strutturate, storico piu ricco e bulk actions.
- Media con storage reale, validazione asset e quality gates.
- Contenuto seed/demo da riallineare a standard editoriale piu alto.
- Osservabilita completa e regression suite browser/a11y piu ampia.

## Prossimo ordine di lavoro consigliato
1. Review workspace completo.
2. Draft persistence lato server.
3. Featured, collections e seed content di livello pubblico.
4. Media workflow reale.
5. Hardening auth, storage, rate limit, observability.
