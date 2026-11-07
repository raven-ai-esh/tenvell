import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/language.js';
import { discoveryHref, discoveryPages } from './routes.js';
import './discovery.css';

export function DiscoveryLinks({ current }) {
  const language = useLanguage();
  return <section className="discovery-links" aria-labelledby="discovery-links-title">
    <h2 id="discovery-links-title">{language === 'ru' ? 'Выберите задачу' : 'Explore by task'}</h2>
    <div className="discovery-link-grid">{discoveryPages.filter(page => page.slug !== current).map(page => <a key={page.slug} href={discoveryHref(page, language)}><span><strong>{page[language].shortTitle}</strong><p>{page[language].description}</p></span><ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" /></a>)}</div>
  </section>;
}
