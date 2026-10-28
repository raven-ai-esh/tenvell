import {readFileSync} from 'node:fs';
import postcss from 'postcss';
const paths=['src/tokens.css','src/components/ui/glass.css','src/catalog/catalog.css','src/components/ui/primitives.css','src/preview/preview.css','src/preview/style-tokens.css','src/interactions/glass-response.css'];
const roots=paths.map(path=>postcss.parse(readFileSync(new URL('../../'+path,import.meta.url),'utf8')));
export function tokensFor(context) {
  const values=new Map();let order=0;
  for(const root of roots)root.walkRules(rule=>{
    for(let parent=rule.parent;parent?.type!=='root';parent=parent.parent)if(parent.type==='atrule'&&(parent.name!=='media'||!parent.params.includes('prefers-reduced-transparency')||!context.reduced))return;
    for(const selector of rule.selectors){
      if(!selector.startsWith(':root')||/\s[.a-z#]/i.test(selector))continue;
      let allowed=true;
      const positive=selector.replace(/:not\(([^)]+)\)/g,(_,negative)=>{if(matchAttributes(negative,context))allowed=false;return '';});
      if(!allowed||!matchAttributes(positive,context))continue;
      const specificity=1+(selector.match(/\[/g)||[]).length;
      rule.walkDecls(decl=>{if(!decl.prop.startsWith('--'))return;const rank=[Number(Boolean(decl.important)),specificity,order++],old=values.get(decl.prop);if(!old||rank[0]>old.rank[0]||rank[0]===old.rank[0]&&(rank[1]>old.rank[1]||rank[1]===old.rank[1]&&rank[2]>old.rank[2]))values.set(decl.prop,{value:decl.value,rank});});
    }
  });
  function resolve(name,chain=[]){if(chain.includes(name))throw new Error('Cyclic token: '+name);const entry=values.get(name);if(!entry)return undefined;return entry.value.replace(/var\((--[\w-]+)(?:,\s*([^()]+))?\)/g,(_,reference,fallback)=>resolve(reference,[...chain,name])??fallback??'');}
  return resolve;
}
function matchAttributes(selector,context){for(const [,name,value] of selector.matchAll(/\[data-([\w-]+)(?:=["']?([\w-]+)["']?)?\]/g)){if(!context[name]||value&&context[name]!==value)return false;}return true;}
export function color(value){
  if(!value)throw new Error('Missing colour token');
  if(value[0]==='#'){let raw=value.slice(1);if(raw.length===3)raw=[...raw].map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(raw.slice(i,i+2),16)).concat(1);}
  const match=value.match(/^rgba?\(([^)]+)\)$/i);if(!match)throw new Error('Not a flat colour: '+value);
  const parts=match[1].replaceAll(',',' ').replace('/',' ').trim().split(/\s+/);return parts.slice(0,3).map(v=>v.endsWith('%')?parseFloat(v)*2.55:Number(v)).concat(parts[3]?(parts[3].endsWith('%')?parseFloat(parts[3])/100:Number(parts[3])):1);
}
export function colors(value){if(value.startsWith('linear-gradient'))return [...value.matchAll(/rgba?\([^)]+\)/g)].map(match=>color(match[0]));return [color(value)];}
export const over=(front,back)=>front.slice(0,3).map((value,index)=>value*front[3]+back[index]*(1-front[3])).concat(1);
export function ratio(a,b){const luminance=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,index)=>sum+v*[.2126,.7152,.0722][index],0);const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
const bounds={light:{light:['#f5f5f2','#d5e6f6','#e9dede','#c8d8e5'],plain:['#f5f5f2'],color:['#b4d3f7','#edc5d1','#cccff1','#eef0f6'],graphic:['#bfd3e5','#d5e6f6','#f0ded4','#e9eff4']},dark:{light:['#121820','#203040','#28313b'],plain:['#121820'],color:['#131c28','#2c4c70','#53304b','#2e345f'],graphic:['#1e354a','#292433','#172330']}};
export function parentColors(context,resolve){const layers=[...colors(resolve('--surface-fill')),...colors(resolve('--surface-hover-fill'))];let previous=bounds[context.theme][context.backdrop].map(color),all=[...previous];for(let depth=0;depth<3;depth++){previous=previous.flatMap(back=>layers.map(layer=>over(layer,back)));all.push(...previous);}const sheen=color(resolve('--convex-sheen'));return [...all,...all.map(back=>over(sheen,back))];}
export function contexts(theme){return ['air','frost','prism','smoke'].flatMap(surface=>['light','plain','color','graphic'].flatMap(backdrop=>['slate','blue','violet','jade'].map(accent=>({theme,surface,backdrop,accent}))));}
