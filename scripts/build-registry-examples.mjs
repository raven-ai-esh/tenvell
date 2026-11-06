// Add real, runnable examples without rebuilding or replacing release archives.
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('..',import.meta.url));
const project=JSON.parse(await readFile(path.join(root,'release/project.json'),'utf8'));
const site=new URL(process.env.TENVELL_SITE_URL||project.siteUrl).origin;
const source=await readFile(path.join(root,'src/release/ButtonDemo.tsx'),'utf8');
const content=source.replace("from '../kit/index.jsx'","from '../button'").replace("import '../kit/kit.css'","import '../styles.css'");
if(content===source||content.includes("../kit/"))throw new Error('Example import rewrite failed');
const item={
  $schema:'https://ui.shadcn.com/schema/registry-item.json',
  name:'button-demo',type:'registry:component',title:'tenvell · First button',
  description:'A runnable button example with its provider, scoped styles, click feedback and light/dark toggle.',
  registryDependencies:[site+'/r/button.json'],
  files:[{path:'examples/button-demo.tsx',type:'registry:component',target:'@components/tenvell/examples/button-demo.tsx',content}],
  docs:'Import ButtonDemo from your components/tenvell/examples/button-demo module and render <ButtonDemo />. The dependency installs the actual Button, TenvellProvider, scoped CSS and licenses.',
  meta:{exampleFor:'button',previewUrl:site+'/install?lang=en#first-component'},
};
const registryPath=path.join(root,'public/r/registry.json');
const registry=JSON.parse(await readFile(registryPath,'utf8'));
registry.items=registry.items.filter(entry=>entry.name!==item.name);
registry.items.push({...item,files:item.files.map(({content,...file})=>file)});
await writeFile(path.join(root,'public/r/button-demo.json'),JSON.stringify(item,null,2)+'\n');
await writeFile(registryPath,JSON.stringify(registry,null,2)+'\n');
console.log('Published registry source: button-demo (existing versioned archives unchanged).');
