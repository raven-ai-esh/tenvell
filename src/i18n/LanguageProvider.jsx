import {useEffect,useMemo} from 'react';
import {TenvellTextContext} from '../components/ui/scope.jsx';
import {useLanguage} from './language.js';
import {translate} from './translate.js';
import {documentMetadata} from '../release/metadata.js';

export function LanguageProvider({children}){
  const language=useLanguage();
  const text=useMemo(()=>value=>translate(value,language),[language]);
  useEffect(()=>{
    document.documentElement.lang=language;
    const metadata=documentMetadata(window.location.pathname);
    document.querySelector('meta[name="description"]')?.setAttribute('content',language==='en'?metadata.description:metadata.descriptionRu);
  },[language]);
  return <TenvellTextContext.Provider value={text}>{children}</TenvellTextContext.Provider>;
}
