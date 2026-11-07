import { createServer } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicDocuments } from '../src/release/metadata.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist/client');
const read = file => readFile(path.join(root, file), 'utf8');
const project = JSON.parse(await read('release/project.json'));
const { version } = JSON.parse(await read('package.json'));
const site = new URL(process.env.TENVELL_SITE_URL || project.siteUrl).origin;
const release = JSON.parse(await read(`public/releases/${version}/manifest.json`));
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const routeModules = { '/': 'src/catalog/OverviewPage.jsx', '/install': 'src/release/InstallPage.jsx', '/agents': 'src/agents/AgentPage.jsx' };
for (const document of publicDocuments) if (document.guide) routeModules[document.path] = 'src/discovery/GuidePage.jsx';

function stylesFor(key, seen = new Set()) {
  if (seen.has(key)) return [];
  seen.add(key);
  const entry = manifest[key];
  if (!entry) throw new Error('Missing static route manifest entry: ' + key);
  return [...(entry.css || []), ...(entry.imports || []).flatMap(name => stylesFor(name, seen))];
}

const server = await createServer({ root, server: { middlewareMode: true, watch: null }, appType: 'custom' });
try {
  const { renderPage } = await server.ssrLoadModule('/scripts/prerender-pages.jsx');
  for (const document of publicDocuments) {
    const markup = await renderPage(document.path, release);
    if (!markup.includes('<h1')) throw new Error('Empty static page: ' + document.path);
    const canonical = site + document.path;
    const schema = {
      '@context': 'https://schema.org', '@graph': [
        { '@type': 'WebSite', '@id': site + '/#website', name: 'tenvell', url: site + '/', inLanguage: ['en', 'ru'] },
        { '@type': 'SoftwareSourceCode', '@id': site + '/#software', name: 'tenvell', url: site + '/', description: publicDocuments[0].description,
          version, codeRepository: project.repositoryUrl, programmingLanguage: ['JavaScript', 'TypeScript', 'CSS'], runtimePlatform: 'React 19',
          license: 'https://opensource.org/license/mit', isAccessibleForFree: true },
        { '@type': document.path === '/agents' || document.guide ? 'TechArticle' : 'WebPage', '@id': canonical + '#page', url: canonical,
          name: document.title, description: document.description, inLanguage: document.language || 'en', ...(document.keywords ? { keywords: document.keywords } : {}), isPartOf: { '@id': site + '/#website' }, about: { '@id': site + '/#software' } },
      ],
    };
    let html = template
      .replace(/<html lang="[^"]*"/, '<html lang="' + (document.language || 'en') + '"')
      .replace('<div id="root"></div>', () => '<div id="root">' + markup + '</div>')
      .replace(/<title>[^<]*<\/title>/, '<title>' + escape(document.title) + '</title>')
      .replace(/<link rel="canonical"[^>]+>/, '<link rel="canonical" href="' + escape(canonical) + '" />')
      .replace(/<link rel="alternate"[^>]+>/, '<link rel="alternate" href="' + document.markdown + '" type="text/markdown" />')
      .replace(/<meta name="description"[^>]+>/, '<meta name="description" content="' + escape(document.description) + '" />')
      .replace(/<meta property="og:title"[^>]+>/, '<meta property="og:title" content="' + escape(document.title) + '" />')
      .replace(/<meta property="og:description"[^>]+>/, '<meta property="og:description" content="' + escape(document.description) + '" />')
      .replace(/<meta property="og:url"[^>]+>/, '<meta property="og:url" content="' + escape(canonical) + '" />');
    const styles = [...new Set(stylesFor(routeModules[document.path]))].filter(file => !html.includes('href="/' + file + '"'));
    const alternates = document.alternates ? Object.entries({ ...document.alternates, 'x-default': document.alternates.en }).map(([locale, href]) => '<link rel="alternate" hreflang="' + locale + '" href="' + site + href + '" />').join('\n') : '';
    html = html.replace('</head>', styles.map(file => '<link rel="stylesheet" href="/' + file + '" />').join('\n') + '\n' + alternates
      + '\n<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>\n</head>');
    const file = document.path === '/' ? 'index.html' : document.path.slice(1) + '.html';
    await mkdir(path.dirname(path.join(dist, file)), { recursive: true });
    await writeFile(path.join(dist, file), html);
    console.log('Rendered ' + document.path + ': ' + Buffer.byteLength(markup) + ' bytes of HTML, including text and links.');
  }
} finally { await server.close(); }
