import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {portableDemoStyles} from '../vite.config.mjs';

const read=async file=>JSON.parse(await readFile(new URL('../public/r/'+file,import.meta.url),'utf8'));
test('a first button demo is advertised as an installable example with its actual dependency',async()=>{
  const index=await read('registry.json');
  const demo=await read('button-demo.json');
  assert.ok(index.items.some(item=>item.name==='button-demo'&&item.type==='registry:component'));
  assert.equal(demo.name,'button-demo');
  assert.deepEqual(demo.registryDependencies,['https://tenvell.space/r/button.json']);
  const source=demo.files.find(file=>file.target==='@components/tenvell/examples/button-demo.tsx');
  assert.ok(source);
  assert.match(source.content,/import .*TenvellProvider.*Button.* from ['"]\.\.\/button['"]/);
  assert.match(source.content,/import ['"]\.\.\/styles\.css['"]/);
  assert.match(source.content,/export default function ButtonDemo/);
  assert.match(source.content,/onClick=/);
});
test('website demo loads the complete scoped theme CSS used by the published dependency',async()=>{
  const plugin=portableDemoStyles();
  const css=await plugin.load(plugin.resolveId('virtual:tenvell-demo.css'));
  const dependency=await read('button.json');
  assert.equal(css,dependency.files.find(file=>file.target==='@components/tenvell/styles.css').content);
  assert.match(css,/@scope \(\.tenvell\)/);
  assert.match(css,/:scope\[data-theme="dark"\]/);
  const source=await readFile(new URL('../src/release/ButtonDemo.tsx',import.meta.url),'utf8');
  assert.match(source,/import 'virtual:tenvell-demo\.css'/);
});
