import {useEffect,useMemo} from 'react';
import {TenvellTextContext} from '../components/ui/scope.jsx';
import {useLanguage} from './language.js';
import {translate} from './translate.js';

export function LanguageProvider({children}){
  const language=useLanguage();
  const text=useMemo(()=>value=>translate(value,language),[language]);
  useEffect(()=>{
    document.documentElement.lang=language;
    document.querySelector('meta[name="description"]')?.setAttribute('content',language==='en'?'tenvell — thin glass UI components, charts and product examples for React. Open source, four glass finishes and original typography.':'tenvell — дизайн-кит для React: тонкое стекло, компоненты, графики и примеры интерфейсов. Открытый код, четыре поверхности и собственный шрифт.');
  },[language]);
  return <TenvellTextContext.Provider value={text}>{children}</TenvellTextContext.Provider>;
}
