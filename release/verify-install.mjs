import {mkdtemp,cp,readFile,writeFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {root,output} from './build-utils.mjs';

const scratch=await mkdtemp(path.join(tmpdir(),'tenvell-0.1-'));
const evidence=process.env.TENVELL_VERIFY_EVIDENCE||path.join(root,'evidence/release-0.1-20261028');
const project=JSON.parse(await readFile(path.join(root,'release/project.json'),'utf8'));
const registryUrl=process.env.TENVELL_REGISTRY_URL||new URL('/r',project.siteUrl).href;
const run=(cmd,args,cwd)=>execFileSync(cmd,args,{cwd,stdio:'inherit',env:{...process.env,CI:'1',DO_NOT_TRACK:'1',SHADCN_TELEMETRY_DISABLED:'1'}});
const json=async(file,data)=>writeFile(file,JSON.stringify(data,null,2)+'\n');
async function addProof(directory,registry=false){
 await cp(path.join(root,'release/fixtures/proof.html'),path.join(directory,'proof.html'));
 let proof=await readFile(path.join(root,'release/fixtures/proof.jsx'),'utf8');if(registry)proof=proof.replaceAll("from 'tenvell'","from './components/tenvell'").replaceAll("import 'tenvell/styles.css'","import './components/tenvell/styles.css'");await writeFile(path.join(directory,'src/proof.jsx'),proof);
 await writeFile(path.join(directory,'vite.config.ts'),"import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';export default defineConfig({plugins:[react()],server:{host:'127.0.0.1'},build:{rollupOptions:{input:['index.html','proof.html']}}});\n");
 const module=registry?'./components/tenvell':'tenvell';
 await writeFile(path.join(directory,'src/type-contracts.tsx'),"import {Button,TenvellProvider,Input,GlassSurface} from '"+module+"';\nconst buttonSurface=<GlassSurface as='button' type='button' onClick={event=>{event.currentTarget.disabled=false;}}>Open</GlassSurface>;\nconst anchorSurface=<GlassSurface as='a' href='/notes' onClick={event=>{event.currentTarget.href;}}>Notes</GlassSurface>;\n// @ts-expect-error button surface cannot receive anchor-only href\nconst invalidSurface=<GlassSurface as='button' href='/notes'/>;\nconst valid=<TenvellProvider surface='frost'><Button variant='outline'/><Input type='email'/></TenvellProvider>;\n// @ts-expect-error unknown material must be rejected\nconst material=<TenvellProvider surface='paper'/>;\n// @ts-expect-error unknown button variant must be rejected\nconst button=<Button variant='invisible'/>;\n// @ts-expect-error arbitrary input props must be rejected\nconst input=<Input missingNativeProp={true}/>;\nvoid [valid,material,button,input,buttonSurface,anchorSurface,invalidSurface];\n");
}

const minimal=path.join(scratch,'minimal');await mkdir(minimal);
await cp(path.join(root,'public/releases/0.1.1/tenvell-0.1.1.tgz'),path.join(minimal,'tenvell-0.1.1.tgz'));
await json(path.join(minimal,'package.json'),{private:true,type:'module',dependencies:{tenvell:'file:./tenvell-0.1.1.tgz',react:'19.2.0','react-dom':'19.2.0'}});
run('npm',['install','--ignore-scripts','--no-audit','--no-fund'],minimal);
run('node',['--input-type=module','-e',"import React from 'react';import {renderToString} from 'react-dom/server';import {TenvellProvider,Button,Dialog,DialogContent} from 'tenvell';let markup=renderToString(React.createElement(TenvellProvider,null,React.createElement(Button,null,'Installed'),React.createElement(Dialog,{defaultOpen:true},React.createElement(DialogContent,null,'Server'))));if(!markup.includes('Installed')||!markup.includes('data-tenvell'))throw new Error('SSR render failed');console.log('Core imports and renders without Recharts or a document global.');"],minimal);

const npmDir=path.join(scratch,'npm');await mkdir(npmDir,{recursive:true});
run('unzip',['-q',path.join(root,'public/releases/0.1.1/tenvell-starter-0.1.1.zip'),'-d',npmDir],scratch);
run('npm',['ci','--ignore-scripts','--no-audit','--no-fund'],npmDir);
await addProof(npmDir);
run('npm',['run','build'],npmDir);

const registryDir=path.join(scratch,'registry');await cp(path.join(root,'release/starter'),registryDir,{recursive:true});
const packageJson=JSON.parse(await readFile(path.join(npmDir,'package.json'),'utf8'));delete packageJson.dependencies.tenvell;packageJson.name='tenvell-registry-consumer';
await json(path.join(registryDir,'package.json'),packageJson);
for(const file of ['App.tsx','main.tsx']){const target=path.join(registryDir,'src',file);let code=await readFile(target,'utf8');code=code.replaceAll("from 'tenvell'","from './components/tenvell'").replaceAll("from 'tenvell/charts'","from './components/tenvell/charts'").replaceAll("import 'tenvell/styles.css'","import './components/tenvell/styles.css'");await writeFile(target,code);}
const config=JSON.parse(await readFile(path.join(registryDir,'tsconfig.json'),'utf8'));config.compilerOptions.baseUrl='.';config.compilerOptions.paths={'@/*':['./src/*']};await json(path.join(registryDir,'tsconfig.json'),config);
await json(path.join(registryDir,'components.json'),{'$schema':'https://ui.shadcn.com/schema.json',style:'new-york',rsc:false,tsx:true,tailwind:{config:'',css:'src/styles.css',baseColor:'neutral',cssVariables:true},aliases:{components:'@/components',utils:'@/lib/utils',ui:'@/components/ui',lib:'@/lib',hooks:'@/hooks'}});
run('npm',['install','--ignore-scripts','--no-audit','--no-fund'],registryDir);
run(path.join(root,'node_modules/.bin/shadcn'),['add',registryUrl+'/tenvell.json',registryUrl+'/charts.json','--yes','--overwrite','--cwd',registryDir],registryDir);
await addProof(registryDir,true);
run('npm',['run','build'],registryDir);
const jsDir=path.join(scratch,'javascript');await mkdir(path.join(jsDir,'src'),{recursive:true});
const jsPackage={...packageJson,name:'tenvell-javascript-consumer',scripts:{build:'vite build'},dependencies:{react:'19.2.0','react-dom':'19.2.0'}};await json(path.join(jsDir,'package.json'),jsPackage);
await writeFile(path.join(jsDir,'index.html'),'<!doctype html><html><head><title>tenvell JavaScript install</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>');
await writeFile(path.join(jsDir,'src/styles.css'),'body{margin:0}');
await writeFile(path.join(jsDir,'src/main.jsx'),"import React from 'react';import {createRoot} from 'react-dom/client';import {Button,TenvellProvider} from './components/tenvell/button';createRoot(document.getElementById('root')).render(<TenvellProvider><Button>JavaScript installed</Button></TenvellProvider>);\n");
await writeFile(path.join(jsDir,'jsconfig.json'),JSON.stringify({compilerOptions:{baseUrl:'.',paths:{'@/*':['./src/*']}}}));
await writeFile(path.join(jsDir,'vite.config.js'),"import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';export default defineConfig({plugins:[react()]});");
const jsConfig=JSON.parse(await readFile(path.join(registryDir,'components.json'),'utf8'));jsConfig.tsx=false;await json(path.join(jsDir,'components.json'),jsConfig);
run('npm',['install','--ignore-scripts','--no-audit','--no-fund'],jsDir);
run(path.join(root,'node_modules/.bin/shadcn'),['add',registryUrl+'/button.json','--yes','--cwd',jsDir],jsDir);
run('npm',['run','build'],jsDir);
const receipt={scratch,minimal,npm:npmDir,registry:registryDir,javascript:jsDir,registryUrl,checks:['minimal package install + server render without Recharts/document','locked starter npm ci + negative API types + TypeScript/Vite build','real shadcn CLI HTTP install + negative API types + TypeScript/Vite build','real JavaScript shadcn profile install + Vite build']};
await mkdir(evidence,{recursive:true});await json(path.join(evidence,'clean-installs.json'),receipt);
console.log('Clean consumers verified at '+scratch);
