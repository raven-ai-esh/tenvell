import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { agentResources } from '../src/agents/resources.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(path.join(root, file), 'utf8');
const project = JSON.parse(await read('release/project.json'));
const { version } = JSON.parse(await read('package.json'));
const site = new URL(process.env.TENVELL_SITE_URL || project.siteUrl).origin;
if (!/^https?:/.test(site)) throw new Error('TENVELL_SITE_URL must be an HTTP(S) origin');
const manifest = JSON.parse(await read(`public/releases/${version}/manifest.json`));
if (manifest.name !== 'tenvell' || manifest.version !== version) throw new Error('Agent docs require a matching published release');

const render = text => text.replace(/\{\{(SITE|REPOSITORY|VERSION)\}\}/g, (_, key) => ({ SITE: site, REPOSITORY: project.repositoryUrl, VERSION: version })[key]);
const emit = async (file, text) => {
  const target = path.join(root, 'public', file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, text.endsWith('\n') ? text : text + '\n');
};
const archive = path.join(root, 'public/releases', version, `tenvell-${version}.tgz`);
const declarations = name => execFileSync('tar', ['-xOf', archive, `package/dist/${name}.d.ts`], { encoding: 'utf8' });
const exportedNames = text => [...text.matchAll(/export (?:declare )?(?:function|const) (\w+)/g)].map(match => match[1]);
const coreTypes = declarations('index');
const chartTypes = declarations('charts');
const registry = JSON.parse(await read('public/r/registry.json'));
const items = [];
for (const entry of registry.items) {
  const item = JSON.parse(await read(`public/r/${entry.name}.json`));
  const module = item.files.find(file => file.target === `@components/tenvell/${entry.name === 'tenvell' ? 'index' : entry.name}.ts`)
    || item.files.find(file => file.target === `@components/tenvell/${entry.name}.jsx`)
    || item.files.find(file => file.target === `@components/tenvell/examples/${entry.name}.tsx`);
  if (!module) throw new Error('Missing public module for registry item ' + entry.name);
  items.push({
    name: entry.name, description: entry.description,
    url: `${site}/r/${entry.name}.json`,
    importFrom: entry.name === 'tenvell' ? '@/components/tenvell' : entry.name === 'button-demo' ? '@/components/tenvell/examples/button-demo' : `@/components/tenvell/${entry.name}`,
    exports: entry.name === 'button-demo' ? ['default'] : exportedNames(module.content),
    dependencies: item.dependencies || [], registryDependencies: item.registryDependencies || [],
  });
}

const documents = {};
for (const name of ['overview', 'install', 'api', 'registry', 'recipes', 'integration']) {
  documents[name] = render(await read(`docs/agents/${name}.md`));
}
documents.api += `\n## Core TypeScript declarations\n\n\`\`\`ts\n${coreTypes.trim()}\n\`\`\`\n\n## Optional chart declarations\n\n\`\`\`ts\n${chartTypes.trim()}\n\`\`\`\n`;
documents.registry += '\n| Item | Purpose | Import from |\n| --- | --- | --- |\n'
  + items.map(item => `| [${item.name}](${item.url}) | ${item.description} | \`${item.importFrom}\` |`).join('\n')
  + '\n\nA source item includes its provider dependency and scoped CSS. Installing several overlapping items may prompt the CLI about existing files; review changes in the target project. The complete core is usually the simplest option when several component families are needed.\n';
for (const [name, text] of Object.entries(documents)) await emit(`docs/${name}.md`, text);
await emit('index.md', documents.overview);
await emit('install.md', documents.install);
await emit('AGENTS.md', documents.integration);
await emit('skills/tenvell-ui/SKILL.md', await read('skills/tenvell-ui/SKILL.md'));

await emit('docs/components.json', JSON.stringify({
  schemaVersion: 1, kind: 'tenvell-component-catalog', name: 'tenvell', version,
  website: site, repository: project.repositoryUrl,
  documentation: `${site}/llms.txt`, api: `${site}/docs/api.md`,
  requirements: { react: '19', nodeTooling: '>=22.12', browserFeatures: ['CSS @scope', 'backdrop-filter'] },
  distribution: {
    package: `${site}/releases/${version}/tenvell-${version}.tgz`,
    manifest: `${site}/releases/${version}/manifest.json`,
    artifacts: manifest.artifacts.map(file => ({ ...file, url: new URL(file.url, site).href })),
  },
  modules: {
    tenvell: { exports: exportedNames(coreTypes), types: `${site}/docs/api.md#core-typescript-declarations` },
    'tenvell/charts': { exports: exportedNames(chartTypes), peerDependency: 'recharts@3.10.1', types: `${site}/docs/api.md#optional-chart-declarations` },
  },
  websiteOnly: ['Calendar', 'DataTable', 'toast', 'messenger', 'task board', 'complete dashboard screens'],
  registry: { index: `${site}/r/registry.json`, namespace: '@tenvell', urlTemplate: `${site}/r/{name}.json`, items },
}, null, 2));

const llms = `# tenvell\n\n> Open-source React 19 UI kit with thin-glass surfaces, scoped CSS, local Lamina fonts and editable shadcn components.\n\nOfficial site: ${site}. Current release: ${version}. Code: MIT; original fonts: SIL OFL 1.1. No account or API key required.\n\nInstall from the official HTTPS tarball or shadcn registry; do not assume a bare npm name. Import the stylesheet once and use TenvellProvider. The core targets modern CSS @scope/backdrop-filter. Calendar, DataTable, toast and complete product demos are website source examples, not core exports.\n\n## Start here\n\n- [Overview and compatibility](${site}/docs/overview.md): product fit, installation choices and limitations.\n- [Installation](${site}/docs/install.md): exact archive and registry commands, first component, starter and checksums.\n- [Integration guide](${site}/AGENTS.md): consumer workflow, import boundaries and verification.\n\n## Reference\n\n- [Published API](${site}/docs/api.md): exact TypeScript declarations and provider settings.\n- [Registry and MCP](${site}/docs/registry.md): item URLs, import modules and official shadcn MCP setup.\n- [Working recipes](${site}/docs/recipes.md): settings form, controlled dialog and Recharts example.\n- [Component inventory](${site}/docs/components.json): project-specific JSON with exports, registry items and release artifacts.\n- [Complete text reference](${site}/llms-full.txt): the full documentation in one request.\n\n## Agent skill\n\n- [tenvell-ui skill](${site}/skills/tenvell-ui/SKILL.md): portable instructions for coding agents integrating tenvell.\n\n## Optional\n\n- [Agent setup page](${site}/agents): human-readable setup and a copyable example prompt; also available as ${site}/AGENTS.md.\n- [Source repository](${project.repositoryUrl}): website, components, original typefaces and MIT/OFL notices.\n- [Release manifest](${site}/releases/${version}/manifest.json): immutable archive byte lengths and SHA-256 hashes.\n`;
await emit('llms.txt', llms);
await emit('llms-full.txt', `# tenvell ${version} — complete agent reference\n\nCanonical source: ${site}/llms.txt. This file describes the published library and its integration, not a hosted action API.\n\n${Object.values(documents).join('\n\n---\n\n')}`);
await emit('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
const urls = ['/', '/install', '/agents', '/typeface.html'];
await emit('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${site}${url}</loc></url>`).join('\n')}\n</urlset>`);

for (const resource of agentResources) {
  await readFile(path.join(root, 'public', resource.path));
}
console.log(`Prepared agent docs for tenvell ${version}: ${items.length} registry items, ${exportedNames(coreTypes).length} core exports.`);
