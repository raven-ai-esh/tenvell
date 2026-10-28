import {t} from "../i18n/translate.js";
import {useLanguage} from '../i18n/language.js';
import {localeHref} from "../i18n/language.js";
import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ArrowDownToLine, ChartNoAxesCombined, ChevronRight, Columns3, Command, Layers2, Menu, MessageCircle, Moon, Search, Sun, X } from "lucide-react";
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "../components/ui";
import { catalogPages, catalogGroups, readCatalogLocation } from "./catalog-data.js";
import { ButtonsPage, CardsPage, FieldsPage, MenusPage } from "./BasicsPages.jsx";
import { DialogsPage } from "./DialogsPage.jsx";
import "./catalog.css";
import {repositoryUrl} from "../release/project.js";
import { searchCatalog } from "./search.js";
import { PreviewControls } from "../preview/PreviewControls.jsx";

const VariantLibrary=lazy(()=>import("./variants/VariantLibrary.jsx"));
const OverviewPage=lazy(()=>import("./OverviewPage.jsx"));
const ExtraPages=lazy(()=>import("./ExtraPages.jsx"));
const BlocksPage=lazy(()=>import("./BlocksPage.jsx"));

const ChartsPage = lazy(() => import("./ChartsPage.jsx"));

class ChartBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="chart-error" role="alert"><ChartNoAxesCombined size={25} strokeWidth={1.4} aria-hidden="true" /><h2>{t("Не удалось загрузить графики")}</h2><p>{t("Попробуйте ещё раз или откройте другой раздел.")}</p><Button variant="outline" onClick={() => window.location.reload()}>{t("Повторить загрузку")}</Button></div>;
    return this.props.children;
  }
}

function Sidebar({ page, onNavigate }) {
  return <nav className="component-nav" aria-label={t("Компоненты")}>
    {catalogGroups.map(group=><div className="catalog-nav-group" key={group}><p className="nav-eyebrow">{t(group)}</p>{catalogPages.filter(item=>item.group===group).map(item=>{const Icon=item.icon;return <a key={item.id} href={localeHref("#"+item.id)} aria-current={page.id===item.id?"page":undefined} onClick={onNavigate}><Icon size={16} strokeWidth={1.5} aria-hidden="true"/><span>{t(item.title)}</span></a>;})}{group==="Начало"&&<a href={localeHref("/install")}><ArrowDownToLine size={16} strokeWidth={1.5} aria-hidden="true"/><span>{t("Установка 0.2")}</span></a>}</div>)}
    <div className="examples-nav"><p className="nav-eyebrow">{t("Полные экраны")}</p><a href={localeHref("/examples/dashboard")}><Layers2 size={16} aria-hidden="true"/>{t("Обзор")}<ArrowUpRight size={12} aria-hidden="true"/></a><a href={localeHref("/examples/messenger")}><MessageCircle size={16} aria-hidden="true"/>{t("Мессенджер")}<ArrowUpRight size={12} aria-hidden="true"/></a><a href={localeHref("/examples/tasks")}><Columns3 size={16} aria-hidden="true"/>{t("Тасктрекер")}<ArrowUpRight size={12} aria-hidden="true"/></a></div>
    <div className="sidebar-material"><span className="material-label">{t("Материал")}</span><p>{t("Тонкая кромка.")}<br />{t("Мягкий свет.")}<br />{t("Ничего лишнего.")}</p><a href={localeHref("/sample")} onClick={onNavigate}>{t("Образец материала")}<ArrowUpRight size={14} aria-hidden="true" /></a><a className="typeface-link" href={localeHref("/typeface.html")}>{t("Собственная гарнитура")}<ArrowUpRight size={14} aria-hidden="true" /></a></div>
  </nav>;
}

function CommandSearch({ open, onOpenChange, returnRef, triggerRef, navigate }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { if (open) { setQuery(""); setActive(0); } }, [open]);
  const results=searchCatalog(catalogPages,query,t);
  useEffect(()=>{if(!open)return;const id=results[active]?.key;if(id)document.getElementById("command-result-"+id)?.scrollIntoView({block:"nearest",inline:"nearest"});},[open,active,query]);
  function choose(id) { navigate(id); onOpenChange(false); }
  function keyboard(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault(); const step = event.key === "ArrowDown" ? 1 : -1; setActive((current) => results.length ? (current + step + results.length) % results.length : 0);
    } else if (event.key === "Enter" && results[active]) { event.preventDefault(); choose(results[active].target); }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="catalog-dialog command-dialog" initialFocus={inputRef} finalFocus={() => returnRef.current?.isConnected ? returnRef.current : triggerRef.current}>
    <DialogTitle className="sr-only">{t("Поиск компонентов")}</DialogTitle><DialogDescription className="sr-only">{t("Введите название и выберите компонент стрелками и Enter.")}</DialogDescription>
    <div className="command-search-row"><Search size={19} strokeWidth={1.5} aria-hidden="true" /><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={keyboard} placeholder={t("Найти компонент…")} aria-label={t("Поиск компонентов")} role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="command-results" aria-activedescendant={results[active] ? "command-result-" + results[active].key : undefined} /><DialogClose render={<Button variant="icon" aria-label={t("Закрыть поиск")} />}><X size={20} aria-hidden="true" /></DialogClose></div>
    <div id="command-results" role="listbox" aria-label={t("Результаты поиска")} className="command-results">{results.length ? results.map((item,index) => { const Icon=item.icon; return <button key={item.key} id={"command-result-" + item.key} role="option" aria-selected={active === index} tabIndex={-1} onMouseEnter={() => setActive(index)} onClick={() => choose(item.target)}><Icon size={18} strokeWidth={1.5} aria-hidden="true" /><span>{t(item.matchTitle||item.title)}<small>{t(item.matchTitle?item.title+" · ":"")}{t(item.english)}</small></span><ArrowUpRight size={15} aria-hidden="true" /></button>; }) : <p className="command-empty" role="status">{t("Ничего не найдено. Попробуйте другое название.")}</p>}</div>
    <div className="command-footer"><span>{t("Стрелки — выбор")}</span><span>{t("Enter — перейти")}</span><span>{t("Esc — закрыть")}</span></div>
  </DialogContent></Dialog>;
}

export function Catalog() {
  const language=useLanguage();
  const [location, setLocation] = useState(readCatalogLocation);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const page = catalogPages.find((item) => item.id === location.id);
  const index = catalogPages.indexOf(page);
  const titleRef = useRef(null);
  const searchRef = useRef(null);
  const searchReturnRef = useRef(null);
  const navRef = useRef(null);
  const previousPage = useRef(page.id);

  useEffect(() => {
    const onHash = () => setLocation(readCatalogLocation());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (previousPage.current !== page.id) { titleRef.current?.focus({ preventScroll: true }); previousPage.current = page.id; }
    const frame = requestAnimationFrame(() => {
      if (location.anchor) document.getElementById(location.anchor)?.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location, page]);
  useEffect(()=>{document.title=t(page.title)+' — tenvell';},[page.title,language]);
  function openSearch() {
    searchReturnRef.current = document.activeElement === document.body ? searchRef.current : document.activeElement;
    setSearchOpen(true);
  }
  useEffect(() => {
    function key(event) { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchReturnRef.current = document.activeElement === document.body ? searchRef.current : document.activeElement; setSearchOpen((current) => !current); } }
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, []);
  function navigate(id) { window.location.hash = id; }

  return <div className="catalog-shell" data-view={page.id}>
    <a className="skip-link" href={localeHref("#catalog-main")} onClick={(event) => { event.preventDefault(); titleRef.current?.focus(); }}>{t("К содержимому")}</a>
    <header className="catalog-header"><div className="catalog-header-inner">
      <Button ref={navRef} variant="icon" className="mobile-nav-trigger" aria-label={t("Открыть навигацию")} aria-haspopup="dialog" aria-expanded={navOpen} onClick={() => setNavOpen(true)}><Menu size={21} strokeWidth={1.5} aria-hidden="true" /></Button>
      <a className="catalog-brand" href={localeHref("#overview")} aria-label={t("tenvell: каталог компонентов")}><Layers2 size={23} strokeWidth={1.35} aria-hidden="true" /><span>tenvell</span><span className="brand-divider" /><small>{t("Тонкое стекло")}</small></a>
      <div className="header-actions"><button className="search-trigger" ref={searchRef} onClick={openSearch} aria-haspopup="dialog" aria-expanded={searchOpen} aria-label={t("Найти компонент")}><Search size={16} strokeWidth={1.5} aria-hidden="true" /><span>{t("Найти компонент…")}</span><kbd><Command size={11} aria-hidden="true" />K</kbd></button><span className="header-divider" /><PreviewControls /><a href={localeHref(repositoryUrl)} className="header-github" target="_blank" rel="noreferrer" aria-label={t("Исходники tenvell на GitHub")}>GitHub<ArrowUpRight size={13} aria-hidden="true"/></a><a href={localeHref("/install")} className="header-install">{t("Установить")}<ArrowDownToLine size={14} aria-hidden="true"/></a><a href={localeHref("/sample")} className="header-sample">{t("Образец")}<ArrowUpRight size={14} aria-hidden="true" /></a></div>
    </div></header>
    <nav className="catalog-section-nav" aria-label={t("Разделы дизайн-кита")}><a href={localeHref("#overview")} aria-current={page.id==="overview"?"page":undefined}>{t("Витрина")}</a><a href={localeHref("#buttons")} aria-current={!["overview","blocks"].includes(page.id)?"page":undefined}>{t("Компоненты")}</a><a href={localeHref("#blocks")} aria-current={page.id==="blocks"?"page":undefined}>{t("Композиции")}</a></nav>
    <div className="catalog-layout">
      <aside className="catalog-sidebar"><Sidebar page={page} /></aside>
      <main id="catalog-main" className="catalog-main">
        {page.id==="overview"?<header className="overview-hero"><span className="overview-kicker">{t("Универсальный дизайн-кит")}</span><h1 ref={titleRef} tabIndex={-1}>{t("Тонкое стекло.")}<br/>{t("Чёткие компоненты.")}</h1><p>{t("Базовые элементы и готовые композиции. Собственный шрифт, тонкие кромки и спокойное движение.")}</p><div className="overview-hero-actions"><Button size="sm" onClick={()=>navigate("buttons")}>{t("Открыть компоненты")}<ArrowRight size={14} aria-hidden="true"/></Button><Button size="sm" variant="outline" onClick={()=>navigate("blocks")}>{t("Смотреть композиции")}</Button><a href={localeHref("/install")} className="header-install">{t("Установить tenvell")}<ArrowDownToLine size={14} aria-hidden="true"/></a></div><span className="overview-hero-footnote">{t("Живые примеры · демонстрационные данные")}</span></header>:<header className="docs-intro"><div className="docs-breadcrumb"><span>{t("Компоненты")}</span><ChevronRight size={13} aria-hidden="true" /><span>{t(page.title)}</span></div><div className="docs-title-row"><h1 ref={titleRef} tabIndex={-1}>{t(page.title)}</h1><span className="component-kind">{t(page.english)}</span></div><p>{t(page.description)}</p></header>}

        <div className="catalog-demo" key={page.id}>
          {["charts","cards","blocks","fields","navigation"].includes(page.id)&&<Suspense fallback={<div className="chart-loading" role="status">{t("Собираем варианты…")}</div>}><VariantLibrary page={page.id}/></Suspense>}
          {page.id === "overview" && <Suspense fallback={<div className="chart-loading" role="status">{t("Собираем витрину…")}</div>}><OverviewPage/></Suspense>}
          {page.id === "blocks" && <Suspense fallback={<div className="chart-loading" role="status">{t("Загружаем композиции…")}</div>}><BlocksPage/></Suspense>}
          {["choice","identity","navigation","details","data","calendar","overlays","feedback"].includes(page.id)&&<Suspense fallback={<div className="chart-loading" role="status">{t("Загружаем примеры…")}</div>}><ExtraPages page={page.id}/></Suspense>}
          {page.id === "buttons" && <ButtonsPage />}
          {page.id === "fields" && <FieldsPage />}
          {page.id === "menus" && <MenusPage openSearch={openSearch} />}
          {page.id === "cards" && <CardsPage />}
          {page.id === "charts" && <ChartBoundary><Suspense fallback={<div role="status" className="chart-loading">{t("Загружаем графики…")}</div>}><ChartsPage /></Suspense></ChartBoundary>}
          {page.id === "dialogs" && <DialogsPage />}
        </div>
        <nav className="page-pagination" aria-label={t("Соседние разделы")}>{index > 0 ? <a href={localeHref("#" + catalogPages[index - 1].id)}><ArrowLeft size={16} aria-hidden="true" /><span><small>{t("Предыдущий раздел")}</small>{t(catalogPages[index - 1].title)}</span></a> : <span />}{index < catalogPages.length - 1 && <a href={localeHref("#" + catalogPages[index + 1].id)}><span><small>{t("Следующий раздел")}</small>{t(catalogPages[index + 1].title)}</span><ArrowRight size={16} aria-hidden="true" /></a>}</nav>
        <footer className="catalog-footer"><Layers2 size={14} strokeWidth={1.3} aria-hidden="true" />{t("Один материал. Много возможностей.")}</footer>
      </main>
      <aside className="catalog-toc"><p>{t("На этой странице")}</p><nav aria-label={t("На этой странице")}>{page.examples.map((item) => <a key={item.id} href={localeHref("#" + page.id + "/" + item.id)}>{t(item.title)}</a>)}</nav><div className="material-note"><span className="material-dot" /><p>{t("Лёгкость — в деталях")}</p><small>{t("Общие цвета, кромки")}<br />{t("и скругления.")}</small></div></aside>
    </div>
    <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} returnRef={searchReturnRef} triggerRef={searchRef} navigate={navigate} />
    <Dialog open={navOpen} onOpenChange={setNavOpen}><DialogContent className="catalog-dialog nav-drawer" finalFocus={navRef}><div className="drawer-heading"><DialogTitle>{t("Компоненты")}</DialogTitle><DialogClose render={<Button variant="icon" aria-label={t("Закрыть навигацию")} />}><X size={21} aria-hidden="true" /></DialogClose></div><DialogDescription className="sr-only">{t("Навигация по каталогу компонентов.")}</DialogDescription><Sidebar page={page} onNavigate={() => setNavOpen(false)} /></DialogContent></Dialog>
  </div>;
}
