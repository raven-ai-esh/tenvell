import {t} from "../i18n/translate.js";
import {localeHref} from "../i18n/language.js";
import {DashboardContent} from "../examples/DashboardContent.jsx";
import {DemoLogin,DemoNotifications,DemoProfile} from "./ShowcaseCards.jsx";
import {Card,ToastViewport,useToast} from "../components/ui";
import {Example} from "./Example.jsx";
import "./showcase.css";
import "./expansion.css";
export default function BlocksPage(){const toast=useToast();return <>
 <div className="blocks-intro"><p>{t("Готовые композиции из общих компонентов. Откройте экран целиком или изучите его части.")}</p><div><a href={localeHref("/examples/dashboard")}>{t("Обзор")}</a><a href={localeHref("/examples/messenger")}>{t("Мессенджер")}</a><a href={localeHref("/examples/tasks")}>{t("Тасктрекер")}</a></div></div>
 <Example id="dashboard" title={t("Обзор с данными")} description={t("Боковая навигация, сводка, график и таблица в одной композиции.")} code={'<DashboardContent />\n\n// Полный пример: /examples/dashboard'} className="blocks-dashboard"><DashboardContent compact/></Example>
 <Example id="login" title={t("Форма входа")} description={t("Ясная иерархия, проверка полей и показ пароля. Локальная демонстрация.")} code={'<Card><DemoLogin /></Card>'}><Card className="showcase-tile blocks-login"><DemoLogin/></Card></Example>
 <Example id="profile-settings" title={t("Профиль и предпочтения")} description={t("Два связанных блока с разной информационной плотностью.")} code={'<div className="two-columns"><Card><Profile /></Card><Card><Preferences /></Card></div>'}><div className="blocks-profile-grid"><Card className="showcase-tile"><DemoProfile/></Card><Card className="showcase-tile"><DemoNotifications toast={toast}/></Card></div></Example>
 <ToastViewport toasts={toast.toasts} onDismiss={toast.dismiss}/>
 </>;}
