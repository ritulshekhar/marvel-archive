# THE MARVEL ARCHIVE

A cinematic, local-first watch tracker for Marvel screen stories. The archive runs without credentials or a database: progress, episode checkmarks, and personal image overrides stay in the browser's local storage. It includes release and continuity-aware timeline views, combined filters, character and universe explorers, progress dashboards, achievements, random picks, and JSON backup/restore.

## Catalogue scope and accuracy

The bundled catalogue is a **curated starter collection, not an exhaustive Marvel screen-media catalogue**. It contains 64 records across eight universes, including MCU, Fox X-Men, Sony, Marvel Television, and standalone continuities. Per-entry source links and chronology confidence are included in `src/lib/catalog.ts`; disputed or approximate placements are labeled. Poster and scene imagery is intentionally absent until an attributable source can be verified. The UI shows an explicit fallback and does not invent a scene still or quote. The coverage audit is generated at `data/coverage-report.json` by `npm run catalog:validate`.

Expand the catalogue with verified entries before describing it as complete. Release dates in this initial collection are premiere/theatrical dates for the listed parent entries; individual episode-level dates and episode records are not yet bundled. Series progress is tracked by episode count, while movie progress is one unit per feature, so series and parent rows are never double-counted.

## Requirements

- Node.js 20.9 or newer
- npm

## Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000. To create a production build, run `npm run build`, then `npm start`.

## Optional metadata enrichment

TMDB credentials are not required to run the app. `.env.example` reserves a server-only token name for a future TMDB integration; the current build does not include an ingestion script or make API calls. If you add that integration, create a TMDB API Read Access Token and put it in `.env.local`:

```env
TMDB_API_READ_ACCESS_TOKEN=your_read_access_token
```

Keep the token server-side; do not prefix it with `NEXT_PUBLIC_`. The app currently uses its reviewed local catalogue and does not send user progress or custom image data to TMDB. Review TMDB's attribution and image-use requirements before publishing metadata or artwork. Optional metadata enrichment is not yet wired into the UI.

## Data and deployment

- Edit catalogue records in `src/lib/catalog.ts` and run `npm run catalog:validate`.
- The validation command checks unique IDs, required release data, episode counts, source references, chronology labels, and records missing artwork. Its report expressly identifies this collection as non-exhaustive.
- `npm run typecheck` and `npm run build` check the app.
- Deploy to any Node-capable Next.js host. The app needs no server database. Browser-local progress is device/browser-specific; use Mission Control's export/import controls to move a JSON backup.
- Add a persistent cloud database/auth layer only if multi-device sync is needed. The current build does not claim cloud sync or authentication.

## Accessibility

The interface supports keyboard-operable controls, visible focus, responsive layouts, and the system's reduced-motion preference. Artwork supplied through a detail record is stored only in the local browser; keep backups modest in size.
