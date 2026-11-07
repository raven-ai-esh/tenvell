import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoveryDocuments, discoveryPages } from '../src/discovery/routes.js';
import { guideCode, guideContent, guideLabels } from '../src/discovery/content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const project = JSON.parse(await readFile(path.join(root, 'release/project.json'), 'utf8'));
const { version } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const site = new URL(process.env.TENVELL_SITE_URL || project.siteUrl).origin;
const absolute = href => new URL(href, site).href;

for (const document of discoveryDocuments) {
  const page = discoveryPages.find(page => document.alternates.en === '/' + page.slug);
  const guide = guideContent[page.slug], copy = guide[document.language], labels = guideLabels[document.language];
  const sections = [`# ${page[document.language].heading}`, `> ${document.description}`, copy.lead];
  for (const section of copy.sections) sections.push('## ' + section.title, ...section.paragraphs);
  if (copy.comparison) sections.push('## ' + labels.comparison,
    [`| ${labels.option} | ${labels.role} | ${labels.choose} |`, '| --- | --- | --- |',
      ...copy.comparison.map(row => `| [${row.name}](${absolute(row.href)}) | ${row.role} | ${row.choose} |`)].join('\n'));
  sections.push('## ' + copy.fitTitle, copy.fit.map(text => '- ' + text).join('\n'), '## ' + copy.scopeTitle, copy.scope.map(text => '- ' + text).join('\n'));
  if (guide.code) {
    sections.push('## ' + labels.snippet);
    if (guide.code !== 'registry') sections.push(`\`\`\`sh\nnpm install ${site}/releases/${version}/tenvell-${version}.tgz\n\`\`\``);
    sections.push(`\`\`\`${guide.code === 'registry' ? 'sh' : 'jsx'}\n${guideCode(guide.code, site)}\n\`\`\``);
  }
  sections.push('## ' + labels.questions);
  for (const item of copy.questions) sections.push('### ' + item.question, item.answer);
  sections.push('## ' + labels.reference, copy.links.map(link => `- [${link.label}](${absolute(link.href)})`).join('\n'),
    `- [llms.txt](${site}/llms.txt)`, `- [${labels.install}](${site}/install)`, `HTML: ${site}${document.path}`);
  const file = path.join(root, 'public', document.markdown);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, sections.join('\n\n') + '\n');
}
console.log(`Prepared ${discoveryDocuments.length} English/Russian discovery documents.`);
