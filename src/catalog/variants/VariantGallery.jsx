import {t} from "../../i18n/translate.js";
import {useEffect,useRef,useState} from 'react';
import {Example} from '../Example.jsx';
import {categoryForAnchor} from './definitions.js';
import './variants.css';

export function VariantGallery({page,items,render,code,wide=false}) {
  const [category,setCategory]=useState(()=>categoryForAnchor(items,window.location.hash.split('/')[1]));
  const pending=useRef('');
  const categories=[...new Set(items.map(item=>item.category))];
  useEffect(()=>{
    let frame;
    const reveal=()=>{
      const [hashPage,anchor='']=window.location.hash.slice(1).split('/');
      if(hashPage!==page)return;
      pending.current=anchor;
      setCategory(categoryForAnchor(items,anchor));
      frame=requestAnimationFrame(()=>{const element=document.getElementById(anchor);if(element){element.scrollIntoView({block:'start'});pending.current='';}});
    };
    reveal();window.addEventListener('hashchange',reveal);
    return()=>{window.removeEventListener('hashchange',reveal);cancelAnimationFrame(frame);};
  },[items,page]);
  useEffect(()=>{if(!pending.current)return;const frame=requestAnimationFrame(()=>{const target=document.getElementById(pending.current);if(target){target.scrollIntoView({block:'start'});pending.current='';}});return()=>cancelAnimationFrame(frame);},[category]);
  const shown=items.filter(item=>category==='all'||item.category===category);
  return <section className={'variant-library'+(wide?' variant-library-wide':'')} aria-label={t("Библиотека вариантов")} data-variant-page={page}>
    <div className="variant-library-heading"><div><span className="variant-eyebrow">{t("Библиотека вариантов")}</span><p>{t("Разные компоновки. Один материал.")}</p></div><span className="variant-count" role="status">{t(shown.length)}{t(" из ")}{t(items.length)}</span></div>
    <div className="variant-filters" role="group" aria-label={t("Типы вариантов")}>{[['all','Все'],...categories.map(value=>[value,value])].map(([value,label])=><button type="button" key={value} aria-pressed={category===value} onClick={()=>{pending.current='';if(window.location.hash.includes('/'))window.history.replaceState(null,'','#'+page);setCategory(value);}}>{t(label)}{value!=='all'&&<small>{t(items.filter(item=>item.category===value).length)}</small>}</button>)}</div>
    <div className="variant-grid">{shown.map(item=><Example key={item.id} id={item.id} title={t(item.title)} description={t(item.description)} code={code(item)} className={'variant-example'+(page==='charts'?' variant-chart-example':'')} frameClassName={page==='charts'?'card':''}><div className="variant-demo">{t(render(item))}</div></Example>)}</div>
    <div className="variant-reference-heading"><h2>{t("Подробные примеры")}</h2><p>{t("Базовые состояния и состав компонентов.")}</p></div>
  </section>;
}
