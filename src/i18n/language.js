import {useSyncExternalStore} from 'react';

export const supportedLanguages=['en','ru'];
const storageKey='tenvell.language';

export function resolveLanguage({url='',stored,languages=[]}={}) {
  const explicit=new URL(url||'https://tenvell.test').searchParams.get('lang');
  if(supportedLanguages.includes(explicit))return explicit;
  if(supportedLanguages.includes(stored))return stored;
  return languages[0]?.toLowerCase().startsWith('ru')?'ru':'en';
}

function readLanguage(){
  let stored;
  try{stored=sessionStorage.getItem(storageKey);}catch{}
  return resolveLanguage({url:typeof window==='undefined'?'':window.location.href,stored,languages:typeof navigator==='undefined'?[]:navigator.languages});
}

let language=readLanguage();
const listeners=new Set();
export const getLanguage=()=>language;
export const getIntlLocale=()=>language==='ru'?'ru-RU':'en-US';
const subscribe=listener=>{listeners.add(listener);return()=>listeners.delete(listener);};
export const useLanguage=()=>useSyncExternalStore(subscribe,getLanguage,()=> 'en');

export function setLanguage(next){
  if(!supportedLanguages.includes(next))return;
  if(typeof window!=='undefined'){
    const url=new URL(window.location.href);
    url.searchParams.set('lang',next);
    window.history.replaceState(window.history.state,'',url);
    try{sessionStorage.setItem(storageKey,next);}catch{}
  }
  if(language===next)return;
  language=next;
  listeners.forEach(listener=>listener());
}

if(typeof window!=='undefined')window.addEventListener('popstate',()=>{
  const next=readLanguage();
  if(next!==language){language=next;listeners.forEach(listener=>listener());}
});

const appRoutes=new Set(['/','/install','/sample','/examples/messenger','/examples/tasks','/examples/dashboard','/typeface.html']);
export function withLanguage(href,locale){
  if(!supportedLanguages.includes(locale)||typeof href!=='string'||!href.startsWith('/')||href.startsWith('//'))return href;
  const url=new URL(href,'https://tenvell.test');
  if(!appRoutes.has(url.pathname))return href;
  url.searchParams.set('lang',locale);
  return url.pathname+url.search+url.hash;
}
export const localeHref=href=>withLanguage(href,language);
