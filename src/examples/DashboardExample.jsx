import {ExampleShell} from "./ExampleScreens.jsx";
import {DashboardContent} from "./DashboardContent.jsx";

export default function DashboardExample(){return <ExampleShell kind="dashboard"><main className="example-screen-wrap dashboard-screen-wrap"><div className="screen-intro"><div><span className="screen-eyebrow">Пример интерфейса</span><h1>Обзор</h1></div><p>Боковая навигация, карточки, график и таблица.</p></div><DashboardContent/></main></ExampleShell>;}
