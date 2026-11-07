import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicDocuments } from '../src/release/metadata.js';
import { canonicalIndexNowUrls, indexNowPayload, submitIndexNow } from './lib/indexnow.mjs';

async function main() {
  const args = process.argv.slice(2);
  let dryRun = false, keyFile = process.env.TENVELL_INDEXNOW_KEY_FILE, urlsFile, receiptFile;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--dry-run') dryRun = true;
    else if (args[index] === '--key-file') keyFile = args[++index];
    else if (args[index] === '--urls-file') urlsFile = args[++index];
    else if (args[index] === '--receipt') receiptFile = args[++index];
    else throw new Error('Unknown IndexNow argument');
  }
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const project = JSON.parse(await readFile(path.join(root, 'release/project.json'), 'utf8'));
  const site = new URL(process.env.TENVELL_SITE_URL || project.siteUrl).origin;
  const urls = canonicalIndexNowUrls(site, urlsFile ? JSON.parse(await readFile(urlsFile, 'utf8')) : publicDocuments.map(document => site + document.path));
  let result;
  if (dryRun) result = { mode: 'dry-run', host: new URL(site).host, urlCount: urls.length, urls, ownershipProof: 'checked_before_submission', indexingStatus: 'UNVERIFIED' };
  else {
    if (!keyFile) throw new Error('Provide --key-file or TENVELL_INDEXNOW_KEY_FILE pointing to the private ownership key outside source control');
    const payload = indexNowPayload(site, (await readFile(keyFile, 'utf8')).trim(), urls);
    result = await submitIndexNow(payload);
  }
  // Receipts deliberately omit both the key and its unpredictable proof URL.
  if (receiptFile) { await mkdir(path.dirname(path.resolve(receiptFile)), { recursive: true }); await writeFile(receiptFile, JSON.stringify(result, null, 2) + '\n'); }
  console.log(JSON.stringify(result, null, 2));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
