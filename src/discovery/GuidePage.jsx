import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers2 } from 'lucide-react';
import { localeHref, useLanguage } from '../i18n/language.js';
import { t } from '../i18n/translate.js';
import { PreviewControls } from '../preview/PreviewControls.jsx';
import { Command } from '../release/Command.jsx';
import ButtonDemo from '../release/ButtonDemo.tsx';
import { repositoryUrl, siteUrl } from '../release/project.js';
import packageInfo from '../../package.json';
import { discoveryDocuments, discoveryHref, discoveryRoute } from './routes.js';
import { guideCode, guideContent, guideLabels } from './content.js';
import { DiscoveryLinks } from './DiscoveryLinks.jsx';
import '../release/install.css';
import './discovery.css';

export function GuidePage({ pathname = window.location.pathname }) {
  const language = useLanguage();
  const route = discoveryRoute(pathname);
  const page = route.page;
  const metadata = page[language];
  const guide = guideContent[page.slug];
  const copy = guide[language];
  const labels = guideLabels[language];
  const markdown = discoveryDocuments.find(document => document.alternates.en === '/' + page.slug && document.language === language).markdown;
  useEffect(() => {
    const canonical = siteUrl + discoveryHref(page, language);
    document.title = metadata.title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('link[rel="alternate"][type="text/markdown"]')?.setAttribute('href', markdown);
    for (const [property, value] of [['og:title', metadata.title], ['og:description', metadata.description], ['og:url', canonical]]) document.querySelector('meta[property="' + property + '"]')?.setAttribute('content', value);
    const structured = document.querySelector('script[type="application/ld+json"]');
    if (structured) {
      const data = JSON.parse(structured.textContent);
      const article = data['@graph']?.find(item => item['@type'] === 'TechArticle');
      if (article) { Object.assign(article, { '@id': canonical + '#page', url: canonical, name: metadata.title, description: metadata.description, inLanguage: language }); structured.textContent = JSON.stringify(data); }
    }
  }, [page, language, metadata.title, metadata.description, markdown]);
  return <div className="catalog-shell" data-view="guide">
    <a className="skip-link" href="#guide-main">{t('К содержимому')}</a>
    <header className="catalog-header"><div className="catalog-header-inner">
      <a className="catalog-brand" href={localeHref('/#overview')} aria-label={t('tenvell: каталог компонентов')}><Layers2 size={23} strokeWidth={1.35} aria-hidden="true" /><span>tenvell</span><span className="brand-divider" /><small>{t('Тонкое стекло')}</small></a>
      <div className="header-actions"><PreviewControls /><a className="header-github" href={repositoryUrl} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13} aria-hidden="true" /></a><a className="header-sample" href={localeHref('/install')}>{labels.install}<ArrowRight size={14} aria-hidden="true" /></a></div>
    </div></header>
    <main id="guide-main" className="release-page guide-page">
      <a className="release-back" href={localeHref('/#overview')}><ArrowLeft size={14} aria-hidden="true" />{labels.back}</a>
      <article>
        <header className="release-intro guide-intro"><span className="overview-kicker">tenvell · {labels.guides}</span><h1>{metadata.heading}</h1><p>{copy.lead}</p><div className="guide-actions"><a className="guide-primary" href={localeHref('/install')}>{labels.install}<ArrowRight size={15} aria-hidden="true" /></a><a className="guide-text-link" href={markdown}>{labels.markdown}<ArrowUpRight size={14} aria-hidden="true" /></a></div></header>
        <div className="guide-body">
          {copy.sections.map((section, index) => <section className="guide-section" key={index}>
            <h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {index === 1 && guide.preview === 'button' && <div className="guide-demo" aria-label={labels.example}><ButtonDemo language={language} /></div>}
            {index === 0 && guide.preview === 'starter' && <figure className="guide-figure"><a href={localeHref('/examples/dashboard')}><img src="/assets/tenvell-preview.png" alt={language === 'ru' ? 'Стартовый экран tenvell с карточками, графиком и локальными элементами управления' : 'The tenvell starter screen with cards, a chart and local controls'} width="1280" height="1000" loading="lazy" /></a><figcaption>{language === 'ru' ? 'Стартовый проект tenvell. Данные примера вымышлены.' : 'The tenvell starter. The example data is fictional.'}</figcaption></figure>}
          </section>)}

          {copy.comparison && <section className="guide-section"><h2>{labels.comparison}</h2><div className="guide-table-scroll" role="region" aria-label={labels.comparison} tabIndex={0}><table className="guide-table"><thead><tr><th scope="col">{labels.option}</th><th scope="col">{labels.role}</th><th scope="col">{labels.choose}</th></tr></thead><tbody>{copy.comparison.map(row => <tr key={row.name}><th scope="row"><a href={row.href.startsWith('/') ? localeHref(row.href) : row.href}>{row.name}<ArrowUpRight size={12} aria-hidden="true" /></a></th><td>{row.role}</td><td>{row.choose}</td></tr>)}</tbody></table></div></section>}

          <div className="guide-fit-grid"><section className="guide-section"><h2>{copy.fitTitle}</h2><ul>{copy.fit.map(item => <li key={item}>{item}</li>)}</ul></section><section className="guide-section"><h2>{copy.scopeTitle}</h2><ul>{copy.scope.map(item => <li key={item}>{item}</li>)}</ul></section></div>

          {guide.code && <section className="guide-section"><h2>{labels.snippet}</h2>{guide.code !== 'registry' && <Command label={labels.install}>{`npm install ${siteUrl}/releases/${packageInfo.version}/tenvell-${packageInfo.version}.tgz`}</Command>}<Command label={labels.snippet}>{guideCode(guide.code, siteUrl)}</Command></section>}

          <section className="guide-section guide-questions"><h2>{labels.questions}</h2>{copy.questions.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section>
          <nav className="guide-references" aria-label={labels.reference}>{copy.links.map(link => <a className="guide-text-link" key={link.href} href={link.href.startsWith('/') ? localeHref(link.href) : link.href}>{link.label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</nav>
          <aside className="guide-agent"><h2>{labels.prompt}</h2><p><a href="/llms.txt">llms.txt</a><span> · </span><a href={localeHref('/agents')}>{language === 'ru' ? 'Skill, API и shadcn MCP' : 'Skill, API and shadcn MCP'}</a></p></aside>
        </div>
      </article>
      <DiscoveryLinks current={page.slug} />
      <footer className="release-footer">tenvell · Thin glass. Clear interfaces.</footer>
    </main>
  </div>;
}
