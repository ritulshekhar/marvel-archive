import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = process.cwd();
const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = fs.readFileSync(path.join(root, 'src/lib/catalog.ts'), 'utf8');
const js = ts.transpile(source, { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 });
const runtimeModule = { exports: {} };
new Function('module', 'exports', js)(runtimeModule, runtimeModule.exports);
const entries = runtimeModule.exports.catalog;
const errors = [];
const warnings = [];
const ids = new Set();
const titles = new Map();
for (const e of entries) {
  if (!e.id || ids.has(e.id)) errors.push(`Missing or duplicate ID: ${e.id || '(empty)'}`);
  ids.add(e.id);
  const key = `${e.universe}|${e.title.toLowerCase()}`;
  if (titles.has(key)) warnings.push(`Possible duplicate title in ${e.universe}: ${e.title}`);
  titles.set(key, true);
  if (!e.title || !e.releaseDate || Number.isNaN(Date.parse(e.releaseDate))) errors.push(`Missing/invalid title or release date: ${e.id}`);
  if (!e.universe || !e.franchise || !e.source) errors.push(`Missing universe, franchise or source: ${e.id}`);
  if (!e.continuityId) errors.push(`Missing separate continuity identifier: ${e.id}`);
  if (!['verified','needs-review','legacy-unreviewed'].includes(e.verificationStatus)) errors.push(`Missing/invalid verification status: ${e.id}`);
  if (e.sourceReferences && e.sourceReferences.some(url => !/^https:\/\//i.test(url))) errors.push(`Invalid source reference URL: ${e.id}`);
  if (!Number.isInteger(e.releaseIndex)) errors.push(`Invalid release index: ${e.id}`);
  if (e.episodes !== undefined && (!Number.isInteger(e.episodes) || e.episodes < 1)) errors.push(`Invalid episode count: ${e.id}`);
  if (e.chronologyConfidence === 'unplaced' && e.chronology !== undefined) warnings.push(`Unplaced entry has chronology number: ${e.id}`);
  if (e.chronologyConfidence === 'estimated' && !e.chronologyLabel?.toLowerCase().match(/approx|estimat|overlap|branch|timeline/)) warnings.push(`Estimated chronology needs visible qualifier: ${e.id}`);
  if (!e.posterUrl) warnings.push(`No verified poster asset; fallback will be used: ${e.id}`);
  if (!e.backdropUrl) warnings.push(`No verified backdrop asset; fallback will be used: ${e.id}`);
}
const report = {
  generatedAt: new Date().toISOString(), catalogueStatus: 'EXPANDED CATALOGUE — NOT EXHAUSTIVE',
  entries: entries.length, universes: [...new Set(entries.map(e => e.universe))].sort(),
  contentTypeCounts: Object.fromEntries([...new Set(entries.map(e => e.type))].sort().map(type => [type, entries.filter(e => e.type === type).length])),
  universeCounts: Object.fromEntries([...new Set(entries.map(e => e.universe))].sort().map(universe => [universe, entries.filter(e => e.universe === universe).length])),
  continuityCounts: Object.fromEntries([...new Set(entries.map(e => e.continuityId))].sort().map(continuity => [continuity, entries.filter(e => e.continuityId === continuity).length])),
  episodeLevelProgressUnits: entries.reduce((sum, e) => sum + (e.episodes || 0), 0),
  episodeLevelSeriesCount: entries.filter(e => e.episodes).length,
  verificationCounts: Object.fromEntries(['verified','needs-review','legacy-unreviewed'].map(status => [status, entries.filter(e => e.verificationStatus === status).length])),
  duplicateIds: errors.filter(e => e.includes('ID')), structuralErrors: errors,
  manualReviewWarnings: warnings, verifiedArtworkCount: entries.filter(e => e.posterUrl && e.backdropUrl).length,
  unverifiedDialogueCount: entries.filter(e => !e.quote).length,
  chronologyCounts: Object.fromEntries(['confirmed','estimated','unplaced'].map(s => [s, entries.filter(e => e.chronologyConfidence === s).length]))
};
const out = path.join(root, 'data/coverage-report.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
console.log(`Catalogue: ${entries.length} entries across ${report.universes.length} universes`);
console.log(`Structural errors: ${errors.length}; review warnings: ${warnings.length}`);
console.log(`Coverage report: ${path.relative(root, out)}`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
