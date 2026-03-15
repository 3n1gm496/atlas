# API (Route Handlers)

## Health
- `GET /api/health`
- Verifica stato runtime + variabili ambiente validate con Zod.

## Entries
- `GET /api/entries?q=&country=&status=&featured=&page=&pageSize=`
  - Ricerca full-text base (title/abstract/description/placeName)
  - Filtri combinabili con paginazione.
- `POST /api/entries` (role >= contributor via header `x-atlas-role`)
  - Crea una nuova entry in stato `draft`.

## Entry detail/update
- `GET /api/entries/:id`
- `PATCH /api/entries/:id` (role >= editor)

## Submission workflow
- `POST /api/submit` (role >= contributor)
  - Input: `{ entryId }`
  - Aggiorna lo stato in `submitted`
  - Rate limiting in-memory (10 richieste/min per IP/header forwarded).

## Taxonomy
- `GET /api/taxonomy/groups`
  - Restituisce gruppi con termini ordinati.

## Analytics
- `GET /api/analytics/overview` (role >= research_admin)
  - Conteggi by status, by country, totale, featured.

## Security e governance
- Tutti gli input principali sono validati con `zod`.
- RBAC applicato lato server con gate per endpoint sensibili.
