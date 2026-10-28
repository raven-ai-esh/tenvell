import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

export const root=path.resolve(import.meta.dirname,'..');
export const output=path.join(root,'release/output');
export const stripCss=code=>code.replace(/^import\s+['"][^'"]+\.css['"];?\s*$/gm,'');
const imports=code=>[...code.matchAll(/(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+)['"]/g)].map(match=>match[1]);
export function targetName(file){
  const relative=path.relative(path.join(root,'src'),file).split(path.sep).join('/');
  if(relative.startsWith('kit/'))return relative.slice(4);
  return relative.replace(/^components\//,'');
}
export async function sourceGraph(entries){
  const graph=new Map(),queue=entries.map(file=>path.resolve(root,file));
  while(queue.length){const file=queue.shift();if(graph.has(file))continue;const code=stripCss(await readFile(file,'utf8'));graph.set(file,code);for(const specifier of imports(code)){const resolved=path.resolve(path.dirname(file),specifier);if(!resolved.startsWith(path.join(root,'src')+path.sep))throw new Error('Source escapes kit: '+specifier);queue.push(resolved);}}
  return graph;
}
export function rewriteModule(file,code){
  const from=targetName(file);
  let result=code.replace(/((?:\bfrom\s*|\bimport\s*)['"])(\.[^'"]+)(['"])/g,(_,start,specifier,end)=>{const to=targetName(path.resolve(path.dirname(file),specifier));let relative=path.posix.relative(path.posix.dirname(from),to);if(!relative.startsWith('.'))relative='./'+relative;return start+relative+end;});
  if(from==='provider.jsx')result='import "./styles.css";\n'+result;
  return '"use client";\n'+result;
}
export async function emitGraph(graph,directory){for(const [file,code] of graph){const dest=path.join(directory,targetName(file));await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,rewriteModule(file,code));}}

const componentClass=name=>/^(ui-|dropdown-|select-|card(?:-|$)|checkbox(?:-|$)|switch(?:-|$)|input$|textarea$|panel-(title|description)$|glass-(surface|picker|swatch|chart|panel)|dialog-backdrop$|field-error$|modal-(fields|footer)$|sr-only$|catalog-dialog$)/.test(name);
function functional(selector){let relevant=false,allowed=true;selectorParser(ast=>ast.walkClasses(node=>{if(node.value==='catalog-shell')return;if(componentClass(node.value))relevant=true;else allowed=false;})).processSync(selector);return relevant&&allowed;}
function scopedSelector(selector){
  let scoped=false;
  const result=selectorParser(ast=>{ast.walkPseudos(node=>{if(node.value===':root'){node.replaceWith(selectorParser.pseudo({value:':scope'}));scoped=true;}});ast.walkClasses(node=>{if(node.value==='catalog-shell'){node.replaceWith(selectorParser.pseudo({value:':scope'}));scoped=true;}if(node.value==='catalog-dialog')node.value='glass-panel';});}).processSync(selector);
  return scoped?result:':where(:scope) '+result;
}
export async function buildStyles(){
  const files=[['src/tokens.css','all'],['src/components/ui/glass.css','all'],['src/styles.css','functional'],['src/catalog/catalog.css','functional'],['src/components/ui/primitives.css','all'],['src/components/ui/button.css','all'],['src/components/ui/checkbox.css','all'],['src/preview/preview.css','roots'],['src/preview/style-tokens.css','functional'],['src/interactions/motion-tokens.css','all'],['src/interactions/glass-response.css','all']];
  const result=postcss.root();
  for(const [file,mode] of files){const tree=postcss.parse(await readFile(path.join(root,file),'utf8'));
    tree.walkAtRules('import',node=>node.remove());
    tree.walkRules(rule=>{if(rule.parent.type==='atrule'&&/keyframes$/.test(rule.parent.name))return;
      const roots=rule.selectors.filter(selector=>selector.startsWith(':root')&&!selector.includes('data-backdrop'));
      if(mode==='roots'){rule.selectors=roots;rule.walkDecls(decl=>{if(!decl.prop.startsWith('--')||decl.prop.startsWith('--preview'))decl.remove();});if(!roots.length||!rule.nodes.length)rule.remove();}
      else if(mode==='functional'){const selectors=rule.selectors.filter(selector=>selector.startsWith(':root')&&!/[\s>+~]/.test(selector)||functional(selector));if(!selectors.length)rule.remove();else rule.selectors=selectors;}
    });
    tree.walkRules(rule=>{if(rule.parent.type==='atrule'&&/keyframes$/.test(rule.parent.name))return;rule.selectors=rule.selectors.map(scopedSelector);});
    tree.walkAtRules(node=>{if(node.nodes&&!node.nodes.length)node.remove();});
    result.append(tree.nodes);
  }
  const keyframes=new Map();result.walkAtRules(node=>{if(/keyframes$/.test(node.name)){keyframes.set(node.params,'tenvell-'+node.params);node.params='tenvell-'+node.params;}});
  result.walkDecls(decl=>{if(decl.prop.startsWith('animation'))for(const [name,replacement] of keyframes)decl.value=decl.value.replace(new RegExp('\\b'+name+'\\b','g'),replacement);});
  let fonts=await readFile(path.join(root,'public/fonts/lamina.css'),'utf8');
  for(const match of [...fonts.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)]){const data=await readFile(path.join(root,'public/fonts',match[1].split('?')[0]));fonts=fonts.replace(match[0],'url("data:font/woff2;base64,'+data.toString('base64')+'")');}
  const base=(await readFile(path.join(root,'src/kit/kit.css'),'utf8')).replace(/\.tenvell(?![\w-])/g,':scope');
  return '/* tenvell0.1.1 — code MIT; embedded Lamina fonts SIL OFL1.1 (FONT-LICENSE.txt). */\n'+fonts+'\n@scope (.tenvell) to (:scope .tenvell) {\n'+result.toString()+'\n'+base+'\n}\n';
}
