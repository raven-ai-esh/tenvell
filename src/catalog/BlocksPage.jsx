import {DashboardContent} from "../examples/DashboardContent.jsx";
import {DemoLogin,DemoNotifications,DemoProfile} from "./ShowcaseCards.jsx";
import {Card,ToastViewport,useToast} from "../components/ui";
import {Example} from "./Example.jsx";
import "./showcase.css";
import "./expansion.css";
export default function BlocksPage(){const toast=useToast();return <>
 <div className="blocks-intro"><p>Готовые композиции из общих компонентов. Откройте экран целиком или изучите его части.</p><div><a href="/examples/dashboard">Обзор</a><a href="/examples/messenger">Мессенджер</a><a href="/examples/tasks">Тасктрекер</a></div></div>
 <Example id="dashboard" title="Обзор с данными" description="Боковая навигация, сводка, график и таблица в одной композиции." code={'<DashboardContent />\n\n// Полный пример: /examples/dashboard'} className="blocks-dashboard"><DashboardContent compact/></Example>
 <Example id="login" title="Форма входа" description="Ясная иерархия, проверка полей и показ пароля. Локальная демонстрация." code={'<Card><DemoLogin /></Card>'}><Card className="showcase-tile blocks-login"><DemoLogin/></Card></Example>
 <Example id="profile-settings" title="Профиль и предпочтения" description="Два связанных блока с разной информационной плотностью." code={'<div className="two-columns"><Card><Profile /></Card><Card><Preferences /></Card></div>'}><div className="blocks-profile-grid"><Card className="showcase-tile"><DemoProfile/></Card><Card className="showcase-tile"><DemoNotifications toast={toast}/></Card></div></Example>
 <ToastViewport toasts={toast.toasts} onDismiss={toast.dismiss}/>
 </>;}
