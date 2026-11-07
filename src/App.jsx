import {t} from "./i18n/translate.js";
import {lazy,Suspense} from "react";
import { Catalog } from "./catalog/Catalog.jsx";
import { SettingsSample } from "./SettingsSample.jsx";
import { MessengerExample, TaskTrackerExample } from "./examples/ExampleScreens.jsx";
import {useLanguage} from './i18n/language.js';
import {discoveryRoute} from './discovery/routes.js';

const DashboardExample=lazy(()=>import("./examples/DashboardExample.jsx"));
const InstallPage=lazy(()=>import("./release/InstallPage.jsx").then(module=>({default:module.InstallPage})));
const AgentPage=lazy(()=>import("./agents/AgentPage.jsx").then(module=>({default:module.AgentPage})));
const GuidePage=lazy(()=>import("./discovery/GuidePage.jsx").then(module=>({default:module.GuidePage})));

export function App() {
  useLanguage();
  if(discoveryRoute(window.location.pathname))return <Suspense fallback={<div className="chart-loading" role="status">{t("Загружаем документацию…")}</div>}><GuidePage/></Suspense>;
  if(["/agents","/agents.html"].includes(window.location.pathname))return <Suspense fallback={<div className="chart-loading" role="status">{t("Загружаем документацию…")}</div>}><AgentPage/></Suspense>;
  if(["/install","/install.html"].includes(window.location.pathname))return <Suspense fallback={<div className="chart-loading" role="status">{t("Загружаем установку…")}</div>}><InstallPage/></Suspense>;
  if(window.location.pathname==="/examples/dashboard")return <Suspense fallback={<div className="chart-loading" role="status">{t("Загружаем пример…")}</div>}><DashboardExample/></Suspense>;
  if(window.location.pathname==="/examples/messenger")return <MessengerExample/>;
  if(window.location.pathname==="/examples/tasks")return <TaskTrackerExample/>;
  return window.location.pathname === "/sample" ? <SettingsSample /> : <Catalog />;
}
