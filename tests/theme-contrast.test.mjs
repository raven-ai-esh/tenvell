import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../src/preview/style-tokens.css',import.meta.url),'utf8');
function luminance(hex){const v=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2];}
const ratio=hex=>1.05/(luminance(hex)+.05);
for(const [selector,body] of [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)].map(m=>[m[1].trim(),m[2]])){const colors=[...body.matchAll(/--primary(?:-hover)?:(#[0-9a-f]{6});/g)].map(m=>m[1]);if(colors.length)test('opaque action foreground contrast: '+selector,()=>{for(const color of colors)assert.ok(ratio(color)>=4.5,color+' '+ratio(color));});}
test('negative control rejects the discovered dark-blue hover pair',()=>assert.ok(ratio('#527d9b')<4.5));
