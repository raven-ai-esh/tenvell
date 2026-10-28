import messages from './messages-en.js';
import {getLanguage} from './language.js';

const cyrillic=/[А-Яа-яЁё]/;
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
let fragments;

export function translate(value,language='en',params){
  if(value&&typeof value==='object'&&typeof value.messageKey==='string')return translate(value.messageKey,language,value.params);
  if(typeof value!=='string')return value;
  let result=value;
  if(language==='en'&&cyrillic.test(value)){
    const source=value.trim();
    const exact=messages[source];
    if(exact!==undefined)result=value.slice(0,value.indexOf(source))+exact+value.slice(value.indexOf(source)+source.length);
    else {
      // Composite demo labels contain stable copy around values such as counts.
      fragments??=Object.keys(messages).filter(key=>key.length>1&&!key.includes('\n')).sort((a,b)=>b.length-a.length).map(key=>[new RegExp((/^[\p{L}\p{N}]/u.test(key)?'(?<![\\p{L}\\p{N}])':'')+escape(key)+(/[\p{L}\p{N}]$/u.test(key)?'(?![\\p{L}\\p{N}])':''),'gu'),messages[key]]);
      for(const [pattern,replacement] of fragments){result=result.replace(pattern,()=>replacement);if(!cyrillic.test(result))break;}
    }
  }
  return params?result.replace(/\{(\w+)\}/g,(match,key)=>Object.hasOwn(params,key)?String(params[key]?.messageKey?translate(params[key],language):params[key]):match):result;
}

export const t=(value,params)=>translate(value,getLanguage(),params);
export const localizeCode=code=>translate(code,getLanguage());
export const message=(messageKey,params)=>({messageKey,params});
export const localizeItems=items=>items.map(item=>({...item,label:t(item.label),description:t(item.description)}));
