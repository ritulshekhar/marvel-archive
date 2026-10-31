import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/lib/catalog.ts', import.meta.url), 'utf8');
const entries = [...source.matchAll(/\{\s*id:'([^']+)',title:'([^']+)',year:(\d+)/g)].map(([, id, title, year]) => ({ id, title, year: Number(year) }));
const enrichment = JSON.parse(fs.readFileSync(new URL('../src/lib/marvel-enrichment-by-id.json', import.meta.url), 'utf8'));
const imageEntries = entries.filter(({ id }) => enrichment[id]?.iconic_moment?.verification_status === 'VERIFIED' && enrichment[id]?.iconic_moment?.image_url);
const dialogueEntries = entries.filter(({ id }) => enrichment[id]?.legendary_dialogue?.verification_status === 'VERIFIED' && enrichment[id]?.legendary_dialogue?.source_url);
const manualReview = entries.filter(({ id }) => !imageEntries.some((entry) => entry.id === id) || !dialogueEntries.some((entry) => entry.id === id));
const report = {
  totalEntries: entries.length,
  authenticSceneImagesAdded: imageEntries.length,
  entriesWithoutVerifiedSceneImages: entries.length - imageEntries.length,
  verifiedDialoguesAdded: dialogueEntries.length,
  entriesWithoutVerifiedDialogue: entries.length - dialogueEntries.length,
  brokenImageUrls: 0,
  brokenImageUrlCheck: 'No URL was confirmed broken; the CDN image URL could not be independently fetched by the research browser. Availability should be rechecked at runtime.',
  entriesRequiringManualReview: manualReview.length,
  addedImages: imageEntries.map(({ id, title }) => ({ id, title, url: enrichment[id].iconic_moment.image_url })),
  addedDialogues: dialogueEntries.map(({ id, title }) => ({ id, title, source: enrichment[id].legendary_dialogue.source_url })),
  entriesWithoutImage: entries.filter(({ id }) => !imageEntries.some((entry) => entry.id === id)).map(({ id, title }) => ({ id, title })),
  entriesWithoutDialogue: entries.filter(({ id }) => !dialogueEntries.some((entry) => entry.id === id)).map(({ id, title }) => ({ id, title })),
  legacyQuoteRecordsPreservedButNotTreatedAsVerified: entries.filter(({ id }) => !dialogueEntries.some((entry) => entry.id === id) && new RegExp(`id:'${id}'.{0,1600}quote:\\{`).test(source)).map(({ id, title }) => ({ id, title }))
};
fs.writeFileSync(new URL('../data/marvel-enrichment-report.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
const md = `# Marvel Archive enrichment report\n\nGenerated from the current catalogue and ID-keyed enrichment dataset.\n\n- Total catalogue entries: **${report.totalEntries}**\n- Authentic scene images added: **${report.authenticSceneImagesAdded}**\n- Entries without verified scene images: **${report.entriesWithoutVerifiedSceneImages}**\n- Verified dialogues added: **${report.verifiedDialoguesAdded}**\n- Entries without verified dialogue: **${report.entriesWithoutVerifiedDialogue}**\n- Broken image URLs confirmed: **${report.brokenImageUrls}** (the single image URL could not be independently fetched by the research browser, so this is not a successful availability check)\n- Entries requiring manual review for at least one section: **${report.entriesRequiringManualReview}**\n\n## Added records\n\n${report.addedImages.map(({ id, title, url }) => `- Image — \`${id}\` (${title}): ${url}`).join('\n') || '- None'}\n\n${report.addedDialogues.map(({ id, title, source }) => `- Dialogue — \`${id}\` (${title}), verified against [Marvel.com](${source}).`).join('\n') || '- None'}\n\n## Existing catalogue quotes\n\n${report.legacyQuoteRecordsPreservedButNotTreatedAsVerified.map(({ id, title }) => `- \`${id}\` — ${title}: retained in the catalogue but hidden in the detail modal until a verification source is added.`).join('\n') || '- None'}\n\nThe full ID-level gap list is in [marvel-enrichment-report.json](./marvel-enrichment-report.json). No missing material was fabricated.\n`;
fs.writeFileSync(new URL('../data/marvel-enrichment-report.md', import.meta.url), md);
console.log(JSON.stringify({ totalEntries: report.totalEntries, images: report.authenticSceneImagesAdded, dialogues: report.verifiedDialoguesAdded, manualReview: report.entriesRequiringManualReview }, null, 2));
