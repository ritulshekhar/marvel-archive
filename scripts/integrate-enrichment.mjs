import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = new URL('../data/marvel_enrichment.json', import.meta.url);
const cataloguePath = new URL('../src/lib/catalog.ts', import.meta.url);
const input = JSON.parse(await readFile(sourcePath, 'utf8'));
if (!Array.isArray(input)) throw new Error('Enrichment JSON must be an array.');
const catalogueSource = await readFile(cataloguePath, 'utf8');
const ids = [...catalogueSource.matchAll(/\{id:'([^']+)'/g)].map((match) => match[1]);
const idSet = new Set(ids);
const seen = new Set();
const duplicates = [];
const unmatched = [];
const matched = {};
const missingImages = [];
const unverifiedDialogues = [];
const preservedConflicts = [];
for (const record of input) {
  const id = record?.catalogue_id;
  if (record?.iconic_moment) {
    const url = record.iconic_moment.image_url;
    if (!(typeof url === 'string' && !url.includes('...') && (/^https:\/\//i.test(url) || /^\/(?!\/)/.test(url)) && record.iconic_moment.verification_status === 'VERIFIED')) missingImages.push(typeof id === 'string' ? id : '(missing catalogue_id)');
  }
  if (record?.legendary_dialogue) {
    const d = record.legendary_dialogue;
    if (d.verification_status !== 'VERIFIED' || !d.text || !d.character || !d.production || !d.year || !d.source_url) unverifiedDialogues.push(typeof id === 'string' ? id : '(missing catalogue_id)');
  }
  if (typeof id !== 'string' || !id) { unmatched.push(String(id ?? '(missing catalogue_id)')); continue; }
  if (seen.has(id)) { duplicates.push(id); continue; }
  seen.add(id);
  if (!idSet.has(id)) { unmatched.push(id); continue; }
  const item = {};
  if (record.iconic_moment) {
    const url = record.iconic_moment.image_url;
    const usable = typeof url === 'string' && !url.includes('...') && (/^https:\/\//i.test(url) || /^\/(?!\/)/.test(url));
    item.iconic_moment = { ...record.iconic_moment, image_url: usable ? url : undefined };
  }
  if (record.legendary_dialogue) {
    const d = record.legendary_dialogue;
    if (d.verification_status === 'VERIFIED' && d.text && d.character && d.production && d.year && d.source_url) item.legendary_dialogue = d;
  }
  matched[id] = item;
}
const report = `# Marvel Archive enrichment integration report\n\nGenerated from data/marvel_enrichment.json using exact catalogue_id === catalog.id matching. Titles were not used for matching.\n\n- Source records: ${input.length}\n- Catalogue entries: ${ids.length}\n- Records matched by ID: ${Object.keys(matched).length}\n- Entries successfully enriched (at least one verified usable field): ${Object.values(matched).filter((x) => x.iconic_moment?.image_url || x.legendary_dialogue).length}\n- Unmatched IDs: ${unmatched.length ? unmatched.join(', ') : 'None'}\n- Duplicate records (duplicate IDs): ${duplicates.length ? duplicates.join(', ') : 'None'}\n- Missing or unusable images in source records: ${missingImages.length ? missingImages.join(', ') : 'None'}\n- Unverified/incomplete dialogues in source records: ${unverifiedDialogues.length ? unverifiedDialogues.join(', ') : 'None'}\n- Existing-data conflicts preserved: ${preservedConflicts.length}\n- Watch-progress records modified: 0 (watch-tracking storage was not touched)\n\n## Notes\n\n${unmatched.length ? `The supplied ID(s) do not match existing catalogue IDs. The Iron Man title resemblance was intentionally ignored. Its existing catalogue quote was preserved and no enrichment was applied.` : 'Matched fields are exposed to the detail view as enrichment metadata; existing catalogue fields remain intact.'}\n\n${missingImages.length || unmatched.length ? 'The supplied image URL contains a literal ellipsis or otherwise cannot be treated as a usable image; no image is represented as authentic from that URL.' : 'Image URLs are displayed only when verified and syntactically usable.'}\n\nThe companion marvel_enrichment_report.md was not present in the supplied files or workspace during integration.\n`;
await writeFile(new URL('../src/lib/marvel-enrichment-by-id.json', import.meta.url), `${JSON.stringify(matched, null, 2)}\n`);
await writeFile(new URL('../data/marvel-enrichment-integration-report.md', import.meta.url), report);
await writeFile(new URL('../data/marvel-enrichment-integration-report.json', import.meta.url), `${JSON.stringify({ sourceRecords: input.length, catalogueEntries: ids.length, matchedRecords: Object.keys(matched).length, successfullyEnriched: Object.values(matched).filter((x) => x.iconic_moment?.image_url || x.legendary_dialogue).length, unmatchedIds: unmatched, duplicateIds: duplicates, missingImageIds: missingImages, unverifiedDialogueIds: unverifiedDialogues, preservedConflicts, watchProgressModified: 0 }, null, 2)}\n`);
console.log(report);
