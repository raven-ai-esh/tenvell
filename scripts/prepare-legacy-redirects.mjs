// Explicit deployment profile for the former hosted origin only.
// Ordinary builds and self-hosted/forked sites must not call this helper.
import {access, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const project=JSON.parse(await readFile(path.join(root,'release/project.json'),'utf8'));
const origin=new URL(project.siteUrl).origin;
if(!origin.startsWith('https://'))throw new Error('Legacy redirects require a public HTTPS canonical origin');
await access(path.join(root,'dist/client/index.html'));
const paths=['/','/typeface','/typeface.html'];
await writeFile(path.join(root,'dist/client/_redirects'),paths.map(p=>p+' '+origin+p+' 308').join('\n')+'\n');
console.log('Prepared legacy static-asset redirects for '+origin+' ('+paths.length+' paths).');
