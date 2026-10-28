import {build} from 'vite';
import react from '@vitejs/plugin-react';
import {execFileSync} from 'node:child_process';
import {cp,mkdir,readFile,writeFile,rm,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {root,output,sourceGraph,emitGraph,buildStyles,stripCss,targetName} from './build-utils.mjs';

async function typedBarrel(graph,apiFile,directory,name,partial=false){
  const declarations=await readFile(path.join(root,apiFile),'utf8');
  const publicNames=[...declarations.matchAll(/export (?:function|const) (\w+)/g)].map(match=>match[1]);
  const types=[...declarations.matchAll(/export (?:type|interface) (\w+)/g)].map(match=>match[1]);
  const typeFile=name==='charts'?'chart-types':'api-types';
  await writeFile(path.join(directory,typeFile+'.ts'),declarations.replace(/^import \{/gm,'import type {').replace(/export function /g,'export declare function ').replace(/export const /g,'export declare const '));
  const lines=['"use client";','import type * as API from "./'+typeFile+'";'];
  const bindings=new Map();let index=0;
  for(const [file,code] of graph){const exports=[...code.matchAll(/export (?:function|const) (\w+)/g)].map(match=>match[1]).filter(value=>publicNames.includes(value));if(!exports.length)continue;const alias='runtime'+index++;lines.push('// @ts-ignore -- JavaScript runtime; the following public bindings use the explicit API contract.','import * as '+alias+' from "./'+targetName(file)+'";');for(const key of exports)bindings.set(key,alias+'.'+key);}
  for(const key of publicNames){if(!bindings.has(key)){if(partial)continue;throw new Error('Missing public runtime export '+key);}lines.push('export const '+key+': typeof API.'+key+' = '+bindings.get(key)+';');}
  if(types.length)lines.push('export type {'+types.join(',')+'} from "./'+typeFile+'";');
  await writeFile(path.join(directory,name+'.ts'),lines.join('\n')+'\n');
  return [name+'.ts',typeFile+'.ts'];
}

const project=JSON.parse(await readFile(path.join(root,'release/project.json'),'utf8'));
const version='0.1.1',site=new URL(process.env.TENVELL_SITE_URL||project.siteUrl||'http://localhost:4187').origin;
if(!/^https?:/.test(site))throw new Error('TENVELL_SITE_URL must be an HTTP(S) origin');
const packageDir=path.join(output,'package'),registryDir=path.join(output,'registry'),starterDir=path.join(output,'starter'),repoDir=path.join(output,'repository');
const downloads=path.join(root,'public/releases',version),registryPublic=path.join(root,'public/r');
await mkdir(output,{recursive:true});
for(const dir of [packageDir,registryDir,starterDir,repoDir])await rm(dir,{recursive:true,force:true});
for(const dir of [packageDir,registryDir,starterDir,repoDir,downloads,registryPublic])await mkdir(dir,{recursive:true});
const mainGraph=await sourceGraph(['src/kit/index.jsx']),chartGraph=await sourceGraph(['src/components/ui/glass-chart-shapes.jsx']);
const completeGraph=new Map([...mainGraph,...chartGraph]);
const css=await buildStyles();
await emitGraph(completeGraph,path.join(packageDir,'source'));
await emitGraph(completeGraph,path.join(registryDir,'source'));
for(const dir of [packageDir,registryDir])await writeFile(path.join(dir,'source/styles.css'),css);
const licenceFiles=['LICENSE','FONT-LICENSE.txt','THIRD-PARTY-NOTICES.md'];
for(const name of licenceFiles){for(const dir of [packageDir,registryDir,root])await cp(path.join(root,'release/licenses',name),path.join(dir,name));}
await cp(path.join(root,'release/docs/PACKAGE-README.md'),path.join(packageDir,'README.md'));
await writeFile(path.join(packageDir,'package.json'),JSON.stringify({name:'tenvell',version,description:'Thin glass UI components for React19',homepage:site,repository:{type:'git',url:project.repositoryUrl+'.git'},bugs:{url:project.repositoryUrl+'/issues'},type:'module',license:'(MIT AND OFL-1.1)',sideEffects:['**/*.css'],files:['dist','source','README.md',...licenceFiles],main:'./dist/index.js',module:'./dist/index.js',types:'./dist/index.d.ts',exports:{'.':{types:'./dist/index.d.ts',import:'./dist/index.js'},'./charts':{types:'./dist/charts.d.ts',import:'./dist/charts.js'},'./styles.css':'./dist/styles.css','./package.json':'./package.json'},peerDependencies:{react:'^19.2.0','react-dom':'^19.2.0',recharts:'^3.10.1'},peerDependenciesMeta:{recharts:{optional:true}},dependencies:{'@base-ui/react':'1.8.0','lucide-react':'1.59.0'},engines:{node:'>=22.12'},keywords:['react','ui','glass','liquid-glass','design-system','shadcn']},null,2)+'\n');
await build({configFile:false,publicDir:false,plugins:[{name:'tenvell-owned-css',enforce:'pre',transform(code,id){if(/\.[jt]sx?$/.test(id)&&id.startsWith(path.join(root,'src')))return stripCss(code);}},react()],build:{outDir:path.join(packageDir,'dist'),emptyOutDir:true,sourcemap:false,lib:{entry:{index:path.join(root,'src/kit/index.jsx'),charts:path.join(root,'src/components/ui/glass-chart-shapes.jsx')},formats:['es'],fileName:(_format,name)=>name+'.js'},rollupOptions:{external:id=>/^(react(?:-dom)?(?:\/|$)|@base-ui\/react(?:\/|$)|lucide-react(?:\/|$)|recharts(?:\/|$))/.test(id),output:{banner:'"use client";'}}}});
await writeFile(path.join(packageDir,'dist/styles.css'),css);
for(const name of ['index','charts'])await cp(path.join(root,'src/kit',name+'.d.ts'),path.join(packageDir,'dist',name+'.d.ts'));

const definitions=[['tenvell','Complete core','src/kit/index.jsx'],['provider','Scoped themes and motion','src/kit/provider.jsx'],['button','Buttons, input and textarea','src/components/ui/controls.jsx'],['checkbox','Checkbox','src/components/ui/checkbox.jsx'],['switch','Switch','src/components/ui/switch.jsx'],['card','Card family','src/components/ui/card.jsx'],['glass','Glass surfaces','src/components/ui/glass.jsx'],['select','Select','src/components/ui/select.jsx'],['menu','Dropdown menu','src/components/ui/menu.jsx'],['dialog','Dialog','src/components/ui/dialog.jsx'],['primitives','Selection, identity and feedback primitives','src/components/ui/primitives.jsx'],['disclosure','Tabs, accordion, popover, sheet and combobox','src/components/ui/advanced.jsx'],['charts','Actual-element Recharts shapes','src/components/ui/glass-chart-shapes.jsx']];
const registry={name:'tenvell',homepage:site,items:[]};
const mainTypes=await typedBarrel(mainGraph,'src/kit/index.d.ts',path.join(registryDir,'source'),'index');
const chartTypes=await typedBarrel(chartGraph,'src/kit/charts.d.ts',path.join(registryDir,'source'),'charts');
for(const [name,title,entry] of definitions){
  const graph=await sourceGraph([entry,'src/kit/provider.jsx']);
  const itemTypes=name==='tenvell'?mainTypes:name==='charts'?chartTypes:await typedBarrel(graph,'src/kit/index.d.ts',path.join(registryDir,'source'),name,true);
  const files=[...graph.keys()].filter(file=>!(name==='tenvell'&&targetName(file)==='index.jsx')).map(file=>({path:'source/'+targetName(file),type:'registry:component',target:'@components/tenvell/'+targetName(file)}));
  files.push({path:'source/styles.css',type:'registry:file',target:'@components/tenvell/styles.css'});
  for(const file of licenceFiles)files.push({path:file,type:'registry:file',target:'@components/tenvell/'+file});
  for(const file of itemTypes)files.push({path:'source/'+file,type:'registry:component',target:'@components/tenvell/'+file});
  const moduleName=targetName(path.resolve(root,entry)).replace(/\.[jt]sx?$/,'');
  registry.items.push({name,type:'registry:ui',title:'tenvell · '+title,description:title+' with scoped thin-glass styling.',dependencies:['@base-ui/react@1.8.0','lucide-react@1.59.0',...(name==='charts'?['recharts@3.10.1']:[])],files,meta:{version},docs:(name==='tenvell'?'Import the full API from your components/tenvell folder.':name==='charts'?'Import shapes from components/tenvell/charts and TenvellProvider from an installed core/provider item.':'Import this item and TenvellProvider from your components/tenvell/'+name+' module. ')});
}
await writeFile(path.join(registryDir,'registry.json'),JSON.stringify(registry,null,2)+'\n');
execFileSync(path.join(root,'node_modules/.bin/shadcn'),['build','registry.json','--cwd',registryDir,'--output',registryPublic],{stdio:'inherit',env:{...process.env,SHADCN_TELEMETRY_DISABLED:'1',DO_NOT_TRACK:'1'}});
await writeFile(path.join(registryPublic,'registry.json'),JSON.stringify(registry,null,2)+'\n');
const tarball='tenvell-'+version+'.tgz';
const pack=JSON.parse(execFileSync('npm',['pack','--json','--ignore-scripts','--pack-destination',downloads],{cwd:packageDir,encoding:'utf8'}));
if(pack[0].filename!==tarball)throw new Error('Unexpected package filename');

await cp(path.join(root,'release/starter'),starterDir,{recursive:true});
await mkdir(path.join(starterDir,'vendor'),{recursive:true});
await cp(path.join(downloads,tarball),path.join(starterDir,'vendor',tarball));
await cp(path.join(packageDir,'README.md'),path.join(starterDir,'vendor/README.md'));
for(const name of licenceFiles)await cp(path.join(root,name),path.join(starterDir,name));
await writeFile(path.join(starterDir,'package.json'),JSON.stringify({name:'tenvell-starter',version,private:true,type:'module',scripts:{dev:'vite',build:'tsc --noEmit && vite build',preview:'vite preview'},dependencies:{tenvell:'file:./vendor/'+tarball,react:'19.2.0','react-dom':'19.2.0',recharts:'3.10.1'},devDependencies:{vite:'6.4.5','@vitejs/plugin-react':'5.0.4',typescript:'5.9.3','@types/react':'19.2.2','@types/react-dom':'19.2.2'},engines:{node:'>=22.12'}},null,2)+'\n');
execFileSync('npm',['install','--package-lock-only','--ignore-scripts','--no-audit','--no-fund'],{cwd:starterDir,stdio:'inherit'});
const starterZip='tenvell-starter-'+version+'.zip';
await rm(path.join(downloads,starterZip),{force:true});
execFileSync('zip',['-qr',path.join(downloads,starterZip),'.'],{cwd:starterDir});

for(const name of ['src','public','scripts','worker','.openai','tests','vite.config.mjs','index.html','package.json','package-lock.json'])await cp(path.join(root,name),path.join(repoDir,name),{recursive:true,filter:file=>!/(?:^|\/)(?:releases|node_modules|\.DS_Store)(?:\/|$)/.test(file)});
for(const name of ['build.mjs','build-utils.mjs','verify-install.mjs','project.json','licenses','docs','starter','schema','fixtures'])await cp(path.join(root,'release',name),path.join(repoDir,'release',name),{recursive:true});
const sourceHosting=JSON.parse(await readFile(path.join(repoDir,'.openai/hosting.json'),'utf8'));
delete sourceHosting.project_id;
await writeFile(path.join(repoDir,'.openai/hosting.json'),JSON.stringify(sourceHosting,null,2)+'\n');
for(const name of ['master.py','build.py','requirements.txt'])await cp(path.join(root,'typeface',name),path.join(repoDir,'typeface',name),{recursive:true});
await cp(path.join(root,'release/docs/FONT-README.md'),path.join(repoDir,'typeface/README.md'));
await cp(path.join(root,'release/licenses/FONT-LICENSE.txt'),path.join(repoDir,'typeface/FONT-LICENSE.txt'));
await cp(path.join(root,'release/docs/REPOSITORY-README.md'),path.join(repoDir,'README.md'));
for(const name of licenceFiles)await cp(path.join(root,name),path.join(repoDir,name));
await writeFile(path.join(repoDir,'.gitignore'),'node_modules/\ndist/\nrelease/output/\nevidence/\n.DS_Store\n');
const sourceZip='tenvell-source-'+version+'.zip';
await rm(path.join(downloads,sourceZip),{force:true});
execFileSync('zip',['-qr',path.join(downloads,sourceZip),'.'],{cwd:repoDir});
const sha=data=>createHash('sha256').update(data).digest('hex');
const artifacts=[];for(const file of [tarball,starterZip,sourceZip]){const data=await readFile(path.join(downloads,file));artifacts.push({file,bytes:data.length,sha256:sha(data),url:'/releases/'+version+'/'+file});}
const inputs=[...completeGraph.keys(),...['src/tokens.css','src/styles.css','src/components/ui/glass.css','src/catalog/catalog.css','src/components/ui/primitives.css','src/components/ui/button.css','src/components/ui/checkbox.css','src/preview/preview.css','src/preview/style-tokens.css','src/interactions/motion-tokens.css','src/interactions/glass-response.css','src/kit/kit.css','src/kit/index.d.ts','src/kit/charts.d.ts','release/build.mjs','release/build-utils.mjs','release/project.json'].map(file=>path.join(root,file))];
const sourceHashes={};for(const file of new Set(inputs))sourceHashes[path.relative(root,file).split(path.sep).join('/')]=sha(await readFile(file));
const manifest={name:'tenvell',version,site,react:'19',artifacts,registry:'/r/tenvell.json',registryItems:definitions.map(item=>item[0]),sourceHashes};
await writeFile(path.join(downloads,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
await writeFile(path.join(output,'package-files.json'),JSON.stringify(pack[0].files,null,2)+'\n');
console.log('tenvell0.1 prepared: '+artifacts.map(file=>file.file+' ('+file.bytes+' bytes)').join(', '));
