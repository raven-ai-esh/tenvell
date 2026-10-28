import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import Ajv from 'ajv';
import {root,output,sourceGraph,buildStyles} from '../release/build-utils.mjs';
import {color,colors,contexts,over,ratio,tokensFor} from './helpers/control-colors.mjs';

const read=file=>readFile(path.join(root,file),'utf8');
const digest=data=>createHash('sha256').update(data).digest('hex');
const packedStyles=()=>execFileSync('tar',['-xOf',path.join(root,'public/releases/0.1.1/tenvell-0.1.1.tgz'),'package/dist/styles.css'],{encoding:'utf8'});

test('distribution does not depend on catalog fixtures, preview globals or host paths',async()=>{
 const graph=await sourceGraph(['src/kit/index.jsx','src/components/ui/glass-chart-shapes.jsx']);
 for(const [file,code] of graph){assert.ok(!file.includes('/catalog/')&&!file.includes('/preview/'),file);assert.doesNotMatch(code,/\/Users\/|localStorage|sessionStorage|fetch\(/,file);}
});
test('all functional CSS selectors are scoped and cannot reset the host page',async()=>{
 const css=packedStyles(),tree=postcss.parse(css);
 assert.ok(css.includes('@scope (.tenvell) to (:scope .tenvell)'), 'Native scope boundary is missing');
 tree.walkRules(rule=>{if(rule.parent.type==='atrule'&&/keyframes$/.test(rule.parent.name))return;for(const selector of rule.selectors){let scoped=false;selectorParser(ast=>ast.walkPseudos(node=>{if(node.value===':scope')scoped=true;})).processSync(selector);assert.ok(scoped,selector);}});
 assert.ok(!/@import|url\(['"]?\/(?:assets|fonts)/.test(css), 'Styles still reference the source website');
});
test('embedded fonts have the exact approved WOFF2 bytes',async()=>{
 const css=packedStyles(),actual=[...css.matchAll(/data:font\/woff2;base64,([^"')]+)/g)].map(match=>digest(Buffer.from(match[1],'base64'))).sort();
 const files=(await readdir(path.join(root,'public/fonts'))).filter(name=>name.endsWith('.woff2'));
 const expected=(await Promise.all(files.map(file=>readFile(path.join(root,'public/fonts',file))))).map(digest).sort();assert.deepEqual(actual,expected);
});
test('portalled dialog text stays readable over both light and dark host content',()=>{
 const tree=postcss.parse(packedStyles());let plate,tint;
 tree.walkRules(rule=>{for(let parent=rule.parent;parent&&parent.type!=='root';parent=parent.parent)if(parent.type==='atrule'&&parent.name==='media')return;
  if(rule.selector===':where(:scope) .glass-panel')rule.walkDecls('background',decl=>plate=decl.value);
  if(rule.selector===':where(:scope) .glass-panel::after')rule.walkDecls('background',decl=>tint=decl.value);
 });
 assert.ok(plate,'Missing dialog plate');
 for(const theme of ['light','dark'])for(const context of contexts(theme)){const get=tokensFor(context),resolve=value=>value.replace(/var\((--[\w-]+)\)/g,(_,key)=>get(key));
  for(const backdrop of [color('#000'),color('#fff')])for(const base of colors(resolve(plate))){const background=over(base,backdrop);for(const surface of tint?colors(resolve(tint)):[color('rgb(0 0 0 / 0%)')]){const final=over(surface,background);for(const name of ['--foreground','--muted-foreground'])assert.ok(ratio(color(get(name)),final)>=4.5,JSON.stringify({context,name,final}));}}
 }
 const old=tokensFor({theme:'dark',surface:'prism',backdrop:'plain',accent:'slate'});assert.ok(colors(old('--surface-fill')).some(fill=>ratio(color(old('--foreground')),over(fill,color('#fff')))<4.5),'Negative control must detect the original transparent dark dialog');
});
test('registry files pass the official schema and have a closed local import graph',async()=>{
 const schema=JSON.parse(await read('release/schema/registry-item.json')),ajv=new Ajv({strict:false,allErrors:true,formats:{uri:true}});
 const meta=JSON.parse(await read('node_modules/ajv/dist/refs/json-schema-draft-07.json'));ajv.addMetaSchema({...meta,$id:'https://json-schema.org/draft-07/schema#'});
 const validate=ajv.compile(schema);
 const names=(await readdir(path.join(root,'public/r'))).filter(name=>name.endsWith('.json')&&name!=='registry.json');
 assert.ok(names.includes('tenvell.json')&&names.includes('charts.json'));
 for(const name of names){const item=JSON.parse(await read('public/r/'+name));assert.ok(validate(item),name+' '+JSON.stringify(validate.errors));const targets=new Set(item.files.map(file=>file.target));
  for(const file of item.files){assert.ok(file.target.startsWith('@components/tenvell/'),file.target);assert.doesNotMatch(file.content,/\/Users\/|Raven\/|new-masterpiece/);if(!/\.[jt]sx?$/.test(file.target))continue;
   for(const match of file.content.matchAll(/(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+)['"]/g)){const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(file.target),match[1]));assert.ok(['','.ts','.tsx','.js','.jsx'].some(extension=>targets.has(resolved+extension)),name+': missing '+resolved);}
  }
 }
});
test('release archives include licences and exclude private/dev workspace material',async()=>{
 const base=path.join(root,'public/releases/0.1.1');
 const files=execFileSync('tar',['-tzf',path.join(base,'tenvell-0.1.1.tgz')],{encoding:'utf8'}).trim().split('\n');
 for(const file of files){assert.ok(file.startsWith('package/'));assert.doesNotMatch(file,/node_modules|evidence|AGENTS|\.env|\.git\/|\.DS_Store/);}
 for(const file of ['package/LICENSE','package/FONT-LICENSE.txt','package/dist/index.d.ts','package/dist/styles.css','package/source/provider.jsx'])assert.ok(files.includes(file),file);
 const source=execFileSync('unzip',['-Z1',path.join(base,'tenvell-source-0.1.1.zip')],{encoding:'utf8'});assert.doesNotMatch(source,/(?:^|\n)(?:evidence|node_modules|AGENTS\.md|\.env|\.git\/)/);
 const hosting=JSON.parse(execFileSync('unzip',['-p',path.join(base,'tenvell-source-0.1.1.zip'),'.openai/hosting.json'],{encoding:'utf8'}));assert.equal(hosting.project_id,undefined,'A public source fork must not inherit the original hosted Site identity');
});
test('release manifest identifies the actual archives and final source inputs',async()=>{
 const manifest=JSON.parse(await read('public/releases/0.1.1/manifest.json'));assert.equal(manifest.version,'0.1.1');
 for(const artifact of manifest.artifacts){const data=await readFile(path.join(root,'public',artifact.url));assert.equal(data.length,artifact.bytes);assert.equal(digest(data),artifact.sha256);}
 for(const [file,hash] of Object.entries(manifest.sourceHashes))assert.equal(digest(await readFile(path.join(root,file))),hash,'Stale generated release: '+file);
 const pkg=JSON.parse(await readFile(path.join(output,'package/package.json'),'utf8'));assert.equal(pkg.name,'tenvell');assert.equal(pkg.private,undefined);assert.ok(pkg.peerDependenciesMeta.recharts.optional);assert.equal(JSON.parse(await read('package.json')).private,true);
});
