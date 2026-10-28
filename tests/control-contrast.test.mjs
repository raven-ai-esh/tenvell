import test from 'node:test';
import assert from 'node:assert/strict';
import {color,colors,contexts,over,parentColors,ratio,tokensFor} from './helpers/control-colors.mjs';
function minimum(values){return values.reduce((min,value)=>value.ratio<min.ratio?value:min,{ratio:Infinity});}
for(const theme of ['light','dark']) {
  test(theme+' control boundaries remain visible over every material and backdrop',()=>{
    const results=[];
    for(const context of contexts(theme)){const get=tokensFor(context);for(const parent of parentColors(context,get)){for(const [state,edgeName,fillName] of [['rest','--control-edge','--control-fill'],['hover','--control-edge-hover','--control-hover'],['focus','--focus','--control-fill']]){for(const fill of colors(get(fillName))){const inside=over(fill,parent),edge=over(color(get(edgeName)),parent);results.push({ratio:Math.min(ratio(edge,parent),ratio(edge,inside)),context,state,parent,edge,inside});}}}}
    const worst=minimum(results);assert.ok(worst.ratio>=3,JSON.stringify(worst));
  });
  test(theme+' text and placeholders remain readable on the control plate',()=>{
    const results=[];for(const context of contexts(theme)){const get=tokensFor(context);for(const parent of parentColors(context,get)){for(const fill of colors(get('--control-fill'))){const plate=over(fill,parent);for(const name of ['--foreground','--muted-foreground'])results.push({ratio:ratio(over(color(get(name)),plate),plate),context,name});}}}const worst=minimum(results);assert.ok(worst.ratio>=4.5,JSON.stringify(worst));
  });
  test(theme+' checked and mixed marks have independent contrast',()=>{
    const results=[];for(const context of contexts(theme)){const get=tokensFor(context),fill=color(get('--selection-fill')||get('--primary')),mark=color(get('--selection-mark')||get('--primary-foreground'));for(const parent of parentColors(context,get)){const plate=over(fill,parent);results.push({ratio:ratio(over(mark,plate),plate),context});}}const worst=minimum(results);assert.ok(worst.ratio>=4.5,JSON.stringify(worst));
  });
  test(theme+' radio dot and switch thumb remain visible in their own controls',()=>{
    const results=[];for(const context of contexts(theme)){const get=tokensFor(context);for(const parent of parentColors(context,get)){for(const fill of colors(get('--control-fill'))){const plate=over(fill,parent);results.push({ratio:ratio(over(color(get('--selection-dot')||get('--primary')),plate),plate),context,part:'radio'});}for(const state of ['off','on']){const track=over(color(get('--switch-'+state)),parent),thumb=color(get('--switch-thumb-'+state)||(state==='on'&&theme==='dark'?'#263442':'#fff'));results.push({ratio:ratio(over(thumb,track),track),context,part:'switch-'+state});}}}const worst=minimum(results);assert.ok(worst.ratio>=3,JSON.stringify(worst));
  });
}
test('contrast maths uses alpha compositing and rejects the original white-on-white contour',()=>{const parent=color('#fff'),whiteEdge=over(color('rgb(255 255 255 / 65%)'),parent);assert.equal(ratio(whiteEdge,parent),1);assert.equal(ratio(color('#000'),color('#fff')),21);assert.deepEqual(over(color('rgb(0 0 0 / 50%)'),parent),[127.5,127.5,127.5,1]);});

for(const theme of ['light','dark'])test(theme+' body and semantic status text stay readable on glass',()=>{const results=[];for(const context of contexts(theme)){const get=tokensFor(context);for(const parent of parentColors(context,get)){for(const [state,background] of [['glass',parent],['quiet-hover',over(color(get('--quiet-hover')),parent)]]){for(const name of ['--foreground','--muted-foreground','--positive','--destructive'])results.push({ratio:ratio(over(color(get(name)),background),background),context,name,state});}}}const worst=minimum(results);assert.ok(worst.ratio>=4.5,JSON.stringify(worst));});
test('CSS cascade resolves theme, material and accent instead of only first declarations',()=>{const light=tokensFor({theme:'light',surface:'air',backdrop:'plain',accent:'slate'}),dark=tokensFor({theme:'dark',surface:'air',backdrop:'plain',accent:'slate'}),blue=tokensFor({theme:'dark',surface:'air',backdrop:'plain',accent:'blue'});assert.notEqual(light('--foreground'),dark('--foreground'));assert.notEqual(dark('--focus'),blue('--focus'));assert.notEqual(light('--surface-fill'),dark('--surface-fill'));});

for(const theme of ['light','dark'])test(theme+' graph contours and line inks remain distinct from glass',()=>{const results=[];for(const context of contexts(theme)){const get=tokensFor(context);for(const parent of parentColors(context,get)){for(const name of ['--control-edge','--chart-ink-1','--chart-ink-2','--chart-ink-3'])results.push({ratio:ratio(over(color(get(name)),parent),parent),context,name});}}const worst=minimum(results);assert.ok(worst.ratio>=3,JSON.stringify(worst));});
