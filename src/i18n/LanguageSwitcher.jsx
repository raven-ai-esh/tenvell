import {setLanguage,useLanguage} from './language.js';
import {t} from './translate.js';
import './language.css';

export function LanguageSwitcher(){
  const language=useLanguage();
  return <div className="language-switcher" role="group" aria-label={t('Язык интерфейса')}>
    <button type="button" lang="en" aria-label="English" title="English" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>EN</button>
    <button type="button" lang="ru" aria-label="Русский" title="Русский" aria-pressed={language==='ru'} onClick={()=>setLanguage('ru')}>RU</button>
  </div>;
}
