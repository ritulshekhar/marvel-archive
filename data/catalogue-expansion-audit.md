# Catalogue expansion and Gemini audit reconciliation

## Inventory and result

- Original catalogue records: 64
- Gemini source records actually supplied: 8 (the prompt described 272)
- Original entries verified through candidate-by-candidate identity/year checks: 5
- Existing duplicate productions already in the app: 0
- Gemini candidates resolved to existing productions: 5
- New records added: 21
- Rejected/unmatched Gemini production suggestions: 0
- Entries requiring manual verification: 60
- Final catalogue records: 85
- Existing IDs, progress keys, custom image keys, and dialogue values changed: 0
- Separate episode-level progress units represented by series: 377 across 25 series records (the parent production is counted once in the catalogue, not again as an extra completion unit)
- Records without both poster and backdrop references: 85; the existing UI fallback remains in use

The provided JSON has 8 records, not 272 missing-production rows. The individual resolutions below cover every row present in that file. No 272-item report was found alongside the JSON.

Beyond those 8 candidates, 18 additional productions were independently added from official Marvel/Disney and 20th Century Studios sources: recent live-action series, animated series, a special, and a documentary series.

## Existing application inventory

- Catalogue schema and records: src/lib/catalog.ts; original count was 64.
- Database: none; the app is local-first and has no Supabase or server database schema.
- Catalogue ingestion: no pre-existing ingestion pipeline; validation is handled by scripts/validate-catalog.mjs.
- Release sorting uses releaseDate; timeline sorting now uses continuityId and chronology confidence/placement.
- Watch state, partial episode checkmarks, timestamps, and custom artwork remain in their existing localStorage keys.
- Series are catalogue parent rows whose episode counts expand into existing ID-based progress units; episodes are not duplicated as separate completion records.
- Movie and series details continue to use the existing modal.

## Counts by content type

- Animated series: 7
- Documentary: 1
- Movie: 57
- Series: 17
- Short: 1
- Special: 2

## Counts by universe

- Amazing Spider-Man: 1
- Fox X-Men: 12
- MCU: 51
- Marvel Animation: 7
- Marvel Studios Documentaries: 1
- Marvel Television: 6
- Other Marvel adaptations: 3
- Raimi Spider-Man: 2
- Sony Spider-Verse: 2

## Candidate resolutions

- **Blade (1998)** — already-in-catalogue as blade
- **X-Men (2000)** — already-in-catalogue as x-men
- **Spider-Man (2002)** — already-in-catalogue as spider-man-2002
- **Daredevil (Marvel Television Series) (2015)** — already-in-catalogue as daredevil-netflix; retained as Marvel Television / Defenders Saga, not reassigned to MCU continuity based only on the audit claim
- **Werewolf by Night (2022)** — added as werewolf-by-night
- **Spider-Man: The Animated Series (1994)** — added as spider-man-animated-series-1994; exact premiere date and production/distribution details still need verification
- **Spider-Man: Into the Spider-Verse (2018)** — already-in-catalogue as into-spider-verse
- **The Consultant (2011)** — added as the-consultant-one-shot

## Continuity and progress notes

Existing IDs are stable. Current localStorage keys and their structures were not migrated or reset. Series continue to use one catalogue row with episode checkboxes stored under the existing ID-based episode keys. Timeline grouping now uses separate continuity IDs; release order remains sorted by release date. Continuity labels are not treated as a shared timeline.

Entries requiring manual verification: iron-man, incredible-hulk, iron-man-2, thor, captain-america-first-avenger, avengers, iron-man-3, thor-dark-world, captain-america-winter-soldier, guardians, age-of-ultron, ant-man, civil-war, doctor-strange, guardians-2, homecoming, ragnarok, black-panther, infinity-war, ant-man-wasp, captain-marvel, endgame, far-from-home, black-widow, shang-chi, eternals, no-way-home, multiverse-madness, love-thunder, wakanda-forever, quantumania, guardians-3, marvels, deadpool-wolverine, brave-new-world, thunderbolts, fantastic-four-first-steps, x2, last-stand, first-class, days-future-past, deadpool, logan, spider-man-2, amazing-spider-man, spider-verse-2, fantastic-four-2005, daredevil-2003, wandavision, loki, hawkeye, moon-knight, she-hulk, jessica-jones, luke-cage, iron-fist, defenders, punisher, x-men-97, spider-man-animated-series-1994. Existing legacy entries not covered by the Gemini candidate file are marked legacy-unreviewed; that status is not a completeness claim.
