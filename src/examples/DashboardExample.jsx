import {t} from "../i18n/translate.js";
import {ExampleShell} from "./ExampleScreens.jsx";
import {DashboardContent} from "./DashboardContent.jsx";

export default function DashboardExample(){return <ExampleShell kind="dashboard"><main className="example-screen-wrap dashboard-screen-wrap"><div className="screen-intro"><div><span className="screen-eyebrow">{t("Пример интерфейса")}</span><h1>{t("Обзор")}</h1></div><p>{t("Боковая навигация, карточки, график и таблица.")}</p></div><DashboardContent/></main></ExampleShell>;}
