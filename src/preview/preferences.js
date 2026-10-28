import {useSyncExternalStore} from "react";

const storageKey="thin-glass-preview-v1";
const allowed={theme:["light","dark"],surface:["air","frost","prism","smoke"],backdrop:["light","plain","color","graphic"],accent:["slate","blue","violet","jade"],radius:["strict","soft","round"],density:["comfortable","compact"]};
const listeners=new Set();
function initial(){
  const fallback={theme:typeof document!=="undefined"&&document.documentElement.dataset.theme==="dark"?"dark":"light",surface:typeof document!=="undefined"?document.querySelector('.task-card[data-glass]')?.dataset.glass||"air":"air",backdrop:"light",accent:"slate",radius:"soft",density:"comfortable"};
  try{const saved=JSON.parse(sessionStorage.getItem(storageKey)||"null");for(const key of Object.keys(allowed))if(allowed[key].includes(saved?.[key]))fallback[key]=saved[key];}catch{}
  return fallback;
}
let snapshot=initial();
function apply(){
  if(typeof document==="undefined")return;
  for(const key of Object.keys(allowed))document.documentElement.dataset[key]=snapshot[key];
}
apply();
function subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);}
function getSnapshot(){return snapshot;}
export function setPreviewSetting(key,value){
  if(!allowed[key]?.includes(value)||snapshot[key]===value)return;
  snapshot={...snapshot,[key]:value};apply();
  try{sessionStorage.setItem(storageKey,JSON.stringify(snapshot));}catch{}
  listeners.forEach(listener=>listener());
}
export function usePreviewSettings(){
  return useSyncExternalStore(subscribe,getSnapshot,getSnapshot);
}
