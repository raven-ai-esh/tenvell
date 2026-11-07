import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicDocuments } from '../src/release/metadata.js';
import { discoveryDocuments } from '../src/discovery/routes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(path.join(root, file), 'utf8');

test('main documents contain text, navigation, matching metadata and styles before JavaScript runs', async () => {
  for (const document of publicDocuments) {
    const filename = document.path === '/' ? 'index.html' : document.path.slice(1) + '.html';
    const html = await read('dist/client/' + filename);
    assert.match(html, /<div id="root">[\s\S]*<h1/);
    assert.ok(document.path === '/agents' ? html.includes('href="/llms.txt"') : /href="\/agents(?:\?lang=(?:en|ru))?"/.test(html), 'The document needs a usable agent entrypoint');
    assert.ok(html.includes('rel="canonical" href="https://tenvell.space' + document.path + '"'));
    assert.ok(html.includes('href="' + document.markdown + '" type="text/markdown"'));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
    assert.equal(schema['@graph'].find(item => item['@type'] === 'SoftwareSourceCode').version, '0.2.1');
    if (document.guide) {
      assert.ok(html.includes('<html lang="' + document.language + '"'));
      assert.ok(html.includes(document.heading), 'The rendered body must use the document language');
      assert.equal(schema['@graph'].find(item => item['@type'] === 'TechArticle').inLanguage, document.language);
      for (const [locale, href] of Object.entries(document.alternates)) assert.ok(html.includes('hreflang="' + locale + '" href="https://tenvell.space' + href + '"'));
    }
    for (const match of html.matchAll(/<link[^>]+href="(\/assets\/[^\"]+\.css)"/g)) await access(path.join(root, 'dist/client', match[1]));
    if (document.path === '/install') assert.match(html, /href="\/releases\/0\.2\.1\/tenvell-0\.2\.1\.tgz"/);
  }
});

test('agent documentation links resolve to actual public files or rendered documents', async () => {
  const paths = ['llms.txt', 'llms-full.txt', 'AGENTS.md', 'index.md', 'install.md', 'docs/overview.md', 'docs/install.md', 'docs/api.md', 'docs/registry.md', 'docs/recipes.md', 'docs/integration.md', 'skills/tenvell-ui/SKILL.md', ...discoveryDocuments.map(document => document.markdown.slice(1))];
  for (const file of paths) {
    const text = await read('public/' + file);
    for (const match of text.matchAll(/\]\((https:\/\/tenvell\.space[^)\s]*)\)/g)) {
      const url = new URL(match[1]);
      const target = publicDocuments.find(document => document.path === url.pathname);
      const clientRoute = ['/sample', '/examples/dashboard', '/examples/messenger', '/examples/tasks'].includes(url.pathname);
      await access(path.join(root, target ? 'dist/client/' + (target.path === '/' ? 'index.html' : target.path.slice(1) + '.html') : clientRoute ? 'dist/client/index.html' : 'public' + url.pathname));
    }
  }
  assert.equal(await read('public/skills/tenvell-ui/SKILL.md'), await read('skills/tenvell-ui/SKILL.md'));
  assert.ok(Buffer.byteLength(await read('public/llms.txt')) < 5000, 'The entrypoint must stay small enough to use as a map');
});

test('compact component inventory identifies published modules, items and real immutable artifacts', async () => {
  const inventory = JSON.parse(await read('public/docs/components.json'));
  const registry = JSON.parse(await read('public/r/registry.json'));
  const manifest = JSON.parse(await read('public/releases/0.2.1/manifest.json'));
  assert.equal(inventory.version, manifest.version);
  assert.deepEqual(inventory.registry.items.map(item => item.name), registry.items.map(item => item.name));
  for (const item of inventory.registry.items) {
    assert.ok(item.exports.length, 'No documented exports for ' + item.name);
    await access(path.join(root, 'public', new URL(item.url).pathname));
  }
  for (const artifact of inventory.distribution.artifacts) assert.equal(artifact.sha256, manifest.artifacts.find(file => file.file === artifact.file).sha256);
  for (const unavailable of ['Calendar', 'DataTable', 'Toast', 'TaskBoard']) assert.ok(!inventory.modules.tenvell.exports.includes(unavailable));
});
