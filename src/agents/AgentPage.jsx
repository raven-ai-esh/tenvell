import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers2 } from 'lucide-react';
import { t } from '../i18n/translate.js';
import { localeHref, useLanguage } from '../i18n/language.js';
import { PreviewControls } from '../preview/PreviewControls.jsx';
import { Command } from '../release/Command.jsx';
import { repositoryUrl, siteUrl } from '../release/project.js';
import { agentPrompt, agentResources } from './resources.js';
import '../release/install.css';
import './agents.css';

export function AgentPage() {
  const language = useLanguage();
  useEffect(() => { document.title = t('Для агентов') + ' — tenvell'; }, [language]);
  const registryConfig = JSON.stringify({ registries: { '@tenvell': siteUrl + '/r/{name}.json' } }, null, 2);
  return <div className="catalog-shell" data-view="agents">
    <a className="skip-link" href="#agent-main">{t('К содержимому')}</a>
    <header className="catalog-header"><div className="catalog-header-inner">
      <a className="catalog-brand" href={localeHref('/#overview')} aria-label={t('tenvell: каталог компонентов')}><Layers2 size={23} strokeWidth={1.35} aria-hidden="true" /><span>tenvell</span><span className="brand-divider" /><small>{t('Тонкое стекло')}</small></a>
      <div className="header-actions"><PreviewControls /><a href={repositoryUrl} className="header-github" target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13} aria-hidden="true" /></a><a href={localeHref('/install')} className="header-sample">{t('Установить')}<ArrowRight size={14} aria-hidden="true" /></a></div>
    </div></header>
    <main id="agent-main" className="release-page agent-page">
      <a className="release-back" href={localeHref('/#overview')}><ArrowLeft size={14} aria-hidden="true" />{t('К каталогу')}</a>
      <div className="release-intro agent-intro"><span className="overview-kicker">tenvell · {t('Для агентов')}</span><h1>{t('Ваш агент.')}<br />{t('Тот же tenvell.')}</h1><p>{t('Документация, компоненты и рабочие примеры для вашего AI-редактора. Дайте агенту точку входа — и собирайте интерфейс вместе.')}</p><div className="agent-intro-links"><a href="/llms.txt">llms.txt<ArrowUpRight size={14} aria-hidden="true" /></a><a href="/skills/tenvell-ui/SKILL.md">tenvell-ui / SKILL.md<ArrowUpRight size={14} aria-hidden="true" /></a></div></div>

      <div className="agent-start-grid">
        <section className="agent-step" aria-labelledby="agent-prompt-title"><span className="agent-step-number">01</span><h2 id="agent-prompt-title">{t('Начните с запроса')}</h2><p className="release-muted">{t('Скопируйте в чат редактора. Агент получит карту документации, проверит API и подключит нужные компоненты.')}</p><Command label={t('запрос для агента')}>{agentPrompt(siteUrl)}</Command></section>
        <section className="agent-step" aria-labelledby="agent-skill-title"><span className="agent-step-number">02</span><h2 id="agent-skill-title">{t('Добавьте skill')}</h2><p className="release-muted">{t('Сохраните порядок работы в совместимом агенте. Skill доступен в репозитории; перед установкой можно прочитать весь файл.')}</p><Command label={t('установка skill')}>npx skills add raven-ai-esh/tenvell --skill tenvell-ui</Command><a className="agent-text-link" href="/skills/tenvell-ui/SKILL.md">{t('Прочитать skill')}<ArrowUpRight size={14} aria-hidden="true" /></a></section>
      </div>

      <section className="agent-mcp" aria-labelledby="agent-mcp-title"><div><span className="agent-step-number">03</span><h2 id="agent-mcp-title">{t('Подключите registry к MCP')}</h2><p className="release-muted">{t('Официальный shadcn MCP умеет искать и устанавливать компоненты tenvell. Добавьте namespace в components.json вашего проекта и настройте сервер в редакторе.')}</p><a className="agent-text-link" href="https://ui.shadcn.com/docs/mcp" target="_blank" rel="noreferrer">{t('Настройка shadcn MCP')}<ArrowUpRight size={14} aria-hidden="true" /></a></div><div><Command label={t('настройка registry')}>{registryConfig}</Command><p className="release-muted">{t('После подключения попросите агента найти компоненты в @tenvell. Для установки без MCP:')}</p><Command label={t('установка компонентов')}>{'npx shadcn@4.23.0 add ' + siteUrl + '/r/tenvell.json'}</Command></div></section>

      <section className="agent-reference" aria-labelledby="agent-reference-title"><div className="agent-reference-heading"><h2 id="agent-reference-title">{t('Чистый текст. Точный API.')}</h2><p className="release-muted">{t('Все файлы открываются напрямую, без JavaScript и авторизации. Справочник API собирается из опубликованного пакета.')}</p></div><div className="agent-resource-grid">{agentResources.map(resource => <a key={resource.path} className="agent-resource" href={resource.path}><span><strong>{t(resource.label)}</strong><small>{resource.path}</small><p>{t(resource.description)}</p></span><ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" /></a>)}</div></section>

      <aside className="agent-scope"><p>{t('React 19 · CSS @scope · четыре поверхности · MIT / OFL')}</p><p className="release-muted">{t('Календарь, таблица, toast и полные экраны витрины доступны в исходниках сайта. Переносимое ядро и каждый элемент registry перечислены отдельно в справочнике.')}</p></aside>
      <footer className="release-footer">tenvell · Thin glass. Clear interfaces.</footer>
    </main>
  </div>;
}
