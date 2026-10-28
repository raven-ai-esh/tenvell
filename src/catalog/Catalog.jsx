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
    if (this.state.failed) return <div className="chart-error" role="alert"><ChartNoAxesCombined size={25} strokeWidth={1.4} aria-hidden="true" /><h2>Не удалось загрузить графики</h2><p>Попробуйте ещё раз или откройте другой раздел.</p><Button variant="outline" onClick={() => window.location.reload()}>Повторить загрузку</Button></div>;
    return this.props.children;
  }
}

function Sidebar({ page, onNavigate }) {
  return <nav className="component-nav" aria-label="Компоненты">
    {catalogGroups.map(group=><div className="catalog-nav-group" key={group}><p className="nav-eyebrow">{group}</p>{catalogPages.filter(item=>item.group===group).map(item=>{const Icon=item.icon;return <a key={item.id} href={"#"+item.id} aria-current={page.id===item.id?"page":undefined} onClick={onNavigate}><Icon size={16} strokeWidth={1.5} aria-hidden="true"/><span>{item.title}</span></a>;})}{group==="Начало"&&<a href="/install"><ArrowDownToLine size={16} strokeWidth={1.5} aria-hidden="true"/><span>Установка 0.1</span></a>}</div>)}
    <div className="examples-nav"><p className="nav-eyebrow">Полные экраны</p><a href="/examples/dashboard"><Layers2 size={16} aria-hidden="true"/>Обзор<ArrowUpRight size={12} aria-hidden="true"/></a><a href="/examples/messenger"><MessageCircle size={16} aria-hidden="true"/>Мессенджер<ArrowUpRight size={12} aria-hidden="true"/></a><a href="/examples/tasks"><Columns3 size={16} aria-hidden="true"/>Тасктрекер<ArrowUpRight size={12} aria-hidden="true"/></a></div>
    <div className="sidebar-material"><span className="material-label">Материал</span><p>Тонкая кромка.<br />Мягкий свет.<br />Ничего лишнего.</p><a href="/sample" onClick={onNavigate}>Образец материала<ArrowUpRight size={14} aria-hidden="true" /></a><a className="typeface-link" href="/typeface.html">Собственная гарнитура<ArrowUpRight size={14} aria-hidden="true" /></a></div>
  </nav>;
}

function CommandSearch({ open, onOpenChange, returnRef, triggerRef, navigate }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { if (open) { setQuery(""); setActive(0); } }, [open]);
  const results=searchCatalog(catalogPages,query);
  useEffect(()=>{if(!open)return;const id=results[active]?.key;if(id)document.getElementById("command-result-"+id)?.scrollIntoView({block:"nearest",inline:"nearest"});},[open,active,query]);
  function choose(id) { navigate(id); onOpenChange(false); }
  function keyboard(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault(); const step = event.key === "ArrowDown" ? 1 : -1; setActive((current) => results.length ? (current + step + results.length) % results.length : 0);
    } else if (event.key === "Enter" && results[active]) { event.preventDefault(); choose(results[active].target); }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="catalog-dialog command-dialog" initialFocus={inputRef} finalFocus={() => returnRef.current?.isConnected ? returnRef.current : triggerRef.current}>
    <DialogTitle className="sr-only">Поиск компонентов</DialogTitle><DialogDescription className="sr-only">Введите название и выберите компонент стрелками и Enter.</DialogDescription>
    <div className="command-search-row"><Search size={19} strokeWidth={1.5} aria-hidden="true" /><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={keyboard} placeholder="Найти компонент…" aria-label="Поиск компонентов" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="command-results" aria-activedescendant={results[active] ? "command-result-" + results[active].key : undefined} /><DialogClose render={<Button variant="icon" aria-label="Закрыть поиск" />}><X size={20} aria-hidden="true" /></DialogClose></div>
    <div id="command-results" role="listbox" aria-label="Результаты поиска" className="command-results">{results.length ? results.map((item,index) => { const Icon=item.icon; return <button key={item.key} id={"command-result-" + item.key} role="option" aria-selected={active === index} tabIndex={-1} onMouseEnter={() => setActive(index)} onClick={() => choose(item.target)}><Icon size={18} strokeWidth={1.5} aria-hidden="true" /><span>{item.matchTitle||item.title}<small>{item.matchTitle?item.title+" · ":""}{item.english}</small></span><ArrowUpRight size={15} aria-hidden="true" /></button>; }) : <p className="command-empty" role="status">Ничего не найдено. Попробуйте другое название.</p>}</div>
    <div className="command-footer"><span>Стрелки — выбор</span><span>Enter — перейти</span><span>Esc — закрыть</span></div>
  </DialogContent></Dialog>;
}

export function Catalog() {
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
    document.title = page.title + " — tenvell";
    if (previousPage.current !== page.id) { titleRef.current?.focus({ preventScroll: true }); previousPage.current = page.id; }
    const frame = requestAnimationFrame(() => {
      if (location.anchor) document.getElementById(location.anchor)?.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location, page]);
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
    <a className="skip-link" href="#catalog-main" onClick={(event) => { event.preventDefault(); titleRef.current?.focus(); }}>К содержимому</a>
    <header className="catalog-header"><div className="catalog-header-inner">
      <Button ref={navRef} variant="icon" className="mobile-nav-trigger" aria-label="Открыть навигацию" aria-haspopup="dialog" aria-expanded={navOpen} onClick={() => setNavOpen(true)}><Menu size={21} strokeWidth={1.5} aria-hidden="true" /></Button>
      <a className="catalog-brand" href="#overview" aria-label="tenvell: каталог компонентов"><Layers2 size={23} strokeWidth={1.35} aria-hidden="true" /><span>tenvell</span><span className="brand-divider" /><small>Тонкое стекло</small></a>
      <div className="header-actions"><button className="search-trigger" ref={searchRef} onClick={openSearch} aria-haspopup="dialog" aria-expanded={searchOpen} aria-label="Найти компонент"><Search size={16} strokeWidth={1.5} aria-hidden="true" /><span>Найти компонент…</span><kbd><Command size={11} aria-hidden="true" />K</kbd></button><span className="header-divider" /><PreviewControls /><a href={repositoryUrl} className="header-github" target="_blank" rel="noreferrer" aria-label="Исходники tenvell на GitHub">GitHub<ArrowUpRight size={13} aria-hidden="true"/></a><a href="/install" className="header-install">Установить<ArrowDownToLine size={14} aria-hidden="true"/></a><a href="/sample" className="header-sample">Образец<ArrowUpRight size={14} aria-hidden="true" /></a></div>
    </div></header>
    <nav className="catalog-section-nav" aria-label="Разделы дизайн-кита"><a href="#overview" aria-current={page.id==="overview"?"page":undefined}>Витрина</a><a href="#buttons" aria-current={!["overview","blocks"].includes(page.id)?"page":undefined}>Компоненты</a><a href="#blocks" aria-current={page.id==="blocks"?"page":undefined}>Композиции</a></nav>
    <div className="catalog-layout">
      <aside className="catalog-sidebar"><Sidebar page={page} /></aside>
      <main id="catalog-main" className="catalog-main">
        {page.id==="overview"?<header className="overview-hero"><span className="overview-kicker">Универсальный дизайн-кит</span><h1 ref={titleRef} tabIndex={-1}>Тонкое стекло.<br/>Чёткие компоненты.</h1><p>Базовые элементы и готовые композиции. Собственный шрифт, тонкие кромки и спокойное движение.</p><div className="overview-hero-actions"><Button size="sm" onClick={()=>navigate("buttons")}>Открыть компоненты<ArrowRight size={14} aria-hidden="true"/></Button><Button size="sm" variant="outline" onClick={()=>navigate("blocks")}>Смотреть композиции</Button><a href="/install" className="header-install">Установить tenvell<ArrowDownToLine size={14} aria-hidden="true"/></a></div><span className="overview-hero-footnote">Живые примеры · демонстрационные данные</span></header>:<header className="docs-intro"><div className="docs-breadcrumb"><span>Компоненты</span><ChevronRight size={13} aria-hidden="true" /><span>{page.title}</span></div><div className="docs-title-row"><h1 ref={titleRef} tabIndex={-1}>{page.title}</h1><span className="component-kind">{page.english}</span></div><p>{page.description}</p></header>}

        <div className="catalog-demo" key={page.id}>
          {["charts","cards","blocks","fields","navigation"].includes(page.id)&&<Suspense fallback={<div className="chart-loading" role="status">Собираем варианты…</div>}><VariantLibrary page={page.id}/></Suspense>}
          {page.id === "overview" && <Suspense fallback={<div className="chart-loading" role="status">Собираем витрину…</div>}><OverviewPage/></Suspense>}
          {page.id === "blocks" && <Suspense fallback={<div className="chart-loading" role="status">Загружаем композиции…</div>}><BlocksPage/></Suspense>}
          {["choice","identity","navigation","details","data","calendar","overlays","feedback"].includes(page.id)&&<Suspense fallback={<div className="chart-loading" role="status">Загружаем примеры…</div>}><ExtraPages page={page.id}/></Suspense>}
          {page.id === "buttons" && <ButtonsPage />}
          {page.id === "fields" && <FieldsPage />}
          {page.id === "menus" && <MenusPage openSearch={openSearch} />}
          {page.id === "cards" && <CardsPage />}
          {page.id === "charts" && <ChartBoundary><Suspense fallback={<div role="status" className="chart-loading">Загружаем графики…</div>}><ChartsPage /></Suspense></ChartBoundary>}
          {page.id === "dialogs" && <DialogsPage />}
        </div>
        <nav className="page-pagination" aria-label="Соседние разделы">{index > 0 ? <a href={"#" + catalogPages[index - 1].id}><ArrowLeft size={16} aria-hidden="true" /><span><small>Предыдущий раздел</small>{catalogPages[index - 1].title}</span></a> : <span />}{index < catalogPages.length - 1 && <a href={"#" + catalogPages[index + 1].id}><span><small>Следующий раздел</small>{catalogPages[index + 1].title}</span><ArrowRight size={16} aria-hidden="true" /></a>}</nav>
        <footer className="catalog-footer"><Layers2 size={14} strokeWidth={1.3} aria-hidden="true" />Один материал. Много возможностей.</footer>
      </main>
      <aside className="catalog-toc"><p>На этой странице</p><nav aria-label="На этой странице">{page.examples.map((item) => <a key={item.id} href={"#" + page.id + "/" + item.id}>{item.title}</a>)}</nav><div className="material-note"><span className="material-dot" /><p>Лёгкость — в деталях</p><small>Общие цвета, кромки<br />и скругления.</small></div></aside>
    </div>
    <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} returnRef={searchReturnRef} triggerRef={searchRef} navigate={navigate} />
    <Dialog open={navOpen} onOpenChange={setNavOpen}><DialogContent className="catalog-dialog nav-drawer" finalFocus={navRef}><div className="drawer-heading"><DialogTitle>Компоненты</DialogTitle><DialogClose render={<Button variant="icon" aria-label="Закрыть навигацию" />}><X size={21} aria-hidden="true" /></DialogClose></div><DialogDescription className="sr-only">Навигация по каталогу компонентов.</DialogDescription><Sidebar page={page} onNavigate={() => setNavOpen(false)} /></DialogContent></Dialog>
  </div>;
}
