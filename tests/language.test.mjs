import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveLanguage,withLanguage,setLanguage,getLanguage} from '../src/i18n/language.js';
import {translate} from '../src/i18n/translate.js';
import {searchCatalog} from '../src/catalog/search.js';
import {filterFiles} from '../src/catalog/variants/fixtures.js';

test('explicit shared language wins over session and browser; invalid choices fall back safely',()=>{
 assert.equal(resolveLanguage({url:'https://tenvell.test/?lang=en#cards',stored:'ru',languages:['ru-RU']}),'en');
 assert.equal(resolveLanguage({url:'https://tenvell.test/?lang=ru',stored:'en',languages:['en-US']}),'ru');
 assert.equal(resolveLanguage({url:'https://tenvell.test/?lang=de',stored:'ru',languages:['en-US']}),'ru');
 assert.equal(resolveLanguage({stored:'invalid',languages:['ru-RU','en-US']}),'ru');
 assert.equal(resolveLanguage({languages:['fr-FR','ru-RU']}),'en');
});

test('language links preserve routes, query parameters and anchors, while release and external URLs stay exact',()=>{
 assert.equal(withLanguage('/install?campaign=launch#start','en'),'/install?campaign=launch&lang=en#start');
 assert.equal(withLanguage('/?lang=ru#cards/card-note','en'),'/?lang=en#cards/card-note');
 assert.equal(withLanguage('/agents?campaign=agent#reference','ru'),'/agents?campaign=agent&lang=ru#reference');
 assert.equal(withLanguage('/react-dashboard-ui-kit?campaign=launch#charts','ru'),'/ru/react-dashboard-ui-kit?campaign=launch#charts');
 assert.equal(withLanguage('/ru/react-dashboard-ui-kit?lang=ru#charts','en'),'/react-dashboard-ui-kit#charts');
 for(const href of ['#charts','https://github.com/raven-ai-esh/tenvell','//example.test/path','/r/tenvell.json','/releases/0.1.1/tenvell-0.1.1.tgz'])assert.equal(withLanguage(href,'ru'),href);
});

test('localized guide URLs select their language independently of stored preferences and switch without losing the route or other query state',()=>{
 assert.equal(resolveLanguage({url:'https://tenvell.test/ru/react-dashboard-ui-kit',stored:'en',languages:['en-US']}),'ru');
 assert.equal(resolveLanguage({url:'https://tenvell.test/react-dashboard-ui-kit',stored:'ru',languages:['ru-RU']}),'en');
 const previousLanguage=getLanguage(),previousWindow=globalThis.window,previousStorage=globalThis.sessionStorage;
 let href='https://tenvell.test/react-dashboard-ui-kit?campaign=launch#charts';
 globalThis.window={get location(){return {href};},history:{state:null,replaceState(_state,_title,next){href=String(next);}}};
 globalThis.sessionStorage={setItem(){}};
 try{
  setLanguage('ru');assert.equal(href,'https://tenvell.test/ru/react-dashboard-ui-kit?campaign=launch#charts');
  setLanguage('en');assert.equal(href,'https://tenvell.test/react-dashboard-ui-kit?campaign=launch#charts');
 }finally{
  if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
  if(previousStorage===undefined)delete globalThis.sessionStorage;else globalThis.sessionStorage=previousStorage;
  setLanguage(previousLanguage);
 }
});

test('owned interface messages translate around user text without translating the user text itself',()=>{
 assert.equal(translate('Тонкое стекло.','en'),'Thin glass.');
 assert.equal(translate('Тонкое стекло.','ru'),'Тонкое стекло.');
 const value={messageKey:'Добавлена задача «{title}».',params:{title:'Название'}};
 assert.equal(translate(value,'en'),'Task «Название» added.');
 assert.equal(translate(value,'ru'),'Добавлена задача «Название».');
 const node={type:'user-data',text:'Сохранить'};assert.equal(translate(node,'en'),node);
});

test('catalog search finds translated variants and retains original-language and ID lookup',()=>{
 const pages=[{id:'charts',title:'Графики',english:'Charts',keywords:'графики',examples:[{id:'bar-horizontal',title:'Горизонтальные столбцы'}]}];
 const tr=value=>({'Горизонтальные столбцы':'Horizontal bars'}[value]||value);
 assert.deepEqual(searchCatalog(pages,'Horizontal bars',tr).map(row=>row.target),['charts/bar-horizontal']);
 assert.deepEqual(searchCatalog(pages,'Горизонтальные',tr).map(row=>row.target),['charts/bar-horizontal']);
 assert.deepEqual(searchCatalog(pages,'bar-horizontal',tr).map(row=>row.target),['charts/bar-horizontal']);
});

test('file search matches translated visible titles without changing the source data',()=>{
 const rows=[{id:'a',title:'План запуска',kind:'Документ',updated:1},{id:'b',title:'Палитра',kind:'Документ',updated:2}];const before=structuredClone(rows);
 const tr=value=>({'План запуска':'Launch plan','Документ':'Document','Палитра':'Palette'}[value]||value);
 assert.deepEqual(filterFiles(rows,'launch','recent',tr).map(row=>row.id),['a']);
 assert.deepEqual(rows,before);
});
