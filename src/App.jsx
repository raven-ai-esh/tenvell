import {lazy,Suspense} from "react";
import { Catalog } from "./catalog/Catalog.jsx";
import { SettingsSample } from "./SettingsSample.jsx";
import { MessengerExample, TaskTrackerExample } from "./examples/ExampleScreens.jsx";

const DashboardExample=lazy(()=>import("./examples/DashboardExample.jsx"));
const InstallPage=lazy(()=>import("./release/InstallPage.jsx").then(module=>({default:module.InstallPage})));

export function App() {
  if(window.location.pathname==="/install")return <Suspense fallback={<div className="chart-loading" role="status">Загружаем установку…</div>}><InstallPage/></Suspense>;
  if(window.location.pathname==="/examples/dashboard")return <Suspense fallback={<div className="chart-loading" role="status">Загружаем пример…</div>}><DashboardExample/></Suspense>;
  if(window.location.pathname==="/examples/messenger")return <MessengerExample/>;
  if(window.location.pathname==="/examples/tasks")return <TaskTrackerExample/>;
  return window.location.pathname === "/sample" ? <SettingsSample /> : <Catalog />;
}
