import {useRef,useState} from "react";
import {ArrowUpRight,CalendarDays,FileText,Folder,HelpCircle,Layers2,MessageCircle,PanelsTopLeft} from "lucide-react";
import {Badge,Button,Card,ToastViewport,useToast} from "../components/ui";
import {DemoBalance,DemoCalendar,DemoChart,DemoEmpty,DemoGoalForm,DemoGoals,DemoLogin,DemoMiniChat,DemoNotifications,DemoPrimitiveCard,DemoProfile,DemoThreshold} from "./ShowcaseCards.jsx";
import "./showcase.css";
import {VariantIndex} from "./variants/VariantIndex.jsx";

export default function OverviewPage(){
 const toast=useToast(),idRef=useRef(3),[goals,setGoals]=useState([{id:1,title:"Новая камера",target:120000,saved:78000},{id:2,title:"Поездка",target:60000,saved:19200}]);
 function createGoal(goal,returnFocus){const next={...goal,id:idRef.current++};setGoals(current=>[...current,next]);toast.show({tone:"success",title:"Цель добавлена",description:next.title+" — в этом примере.",returnFocus,action:{label:"Отменить",onClick:()=>setGoals(current=>current.filter(item=>item.id!==next.id))}});}
 return <><VariantIndex/><div className="showcase-masonry" id="showcase">
  <div className="showcase-column">
   <Card className="showcase-tile"><DemoPrimitiveCard toast={toast}/></Card>
   <div className="showcase-nav-pair">{[{title:"Коллекция",items:[{label:"Документы",href:"#data",icon:FileText},{label:"Даты",href:"#calendar",icon:CalendarDays},{label:"Слои",href:"#overlays",icon:Layers2}]},{title:"Справка",items:[{label:"Компоненты",href:"#buttons",icon:PanelsTopLeft},{label:"Поверхности",href:"#cards/metrics",icon:Folder},{label:"Ответы",href:"#details",icon:HelpCircle}]}].map(group=><Card key={group.title} className="showcase-tile showcase-nav-tile"><h3>{group.title}</h3>{group.items.map(({label,href,icon:Icon})=><a key={label} href={href}><Icon size={14} strokeWidth={1.5} aria-hidden="true"/>{label}</a>)}</Card>)}</div>
   <Card className="showcase-tile"><DemoProfile/></Card>
   <Card className="showcase-tile showcase-example-link"><Badge>Экран</Badge><h3>Мессенджер</h3><p>Список, переписка и действие в одном пространстве.</p><a href="/examples/messenger">Открыть пример<ArrowUpRight size={14} aria-hidden="true"/></a></Card>
  </div>
  <div className="showcase-column">
   <Card className="showcase-tile"><DemoChart financial/></Card>
   <Card className="showcase-tile"><DemoGoals goals={goals}/></Card>
   <Card className="showcase-tile"><DemoBalance/></Card>
   <Card className="showcase-tile showcase-example-link"><Badge>Экран</Badge><h3>Доска задач</h3><p>Перетаскивание, поиск и состояния карточек.</p><a href="/examples/tasks">Открыть пример<ArrowUpRight size={14} aria-hidden="true"/></a></Card>
  </div>
  <div className="showcase-column">
   <Card className="showcase-tile"><DemoGoalForm onCreate={createGoal} toast={toast}/></Card>
   <Card className="showcase-tile"><DemoThreshold/></Card>
   <Card className="showcase-tile"><DemoNotifications toast={toast}/></Card>
  </div>
  <div className="showcase-column">
   <Card className="showcase-tile showcase-calendar-tile"><DemoCalendar/></Card>
   <Card className="showcase-tile"><DemoMiniChat/></Card>
   <Card className="showcase-tile"><DemoLogin/></Card>
   <Card className="showcase-tile showcase-empty-tile"><DemoEmpty/></Card>
  </div>
 </div><section className="showcase-next" id="scenarios"><div><Badge>Композиции</Badge><h2>От элемента — к целому экрану.</h2><p>Обзор с таблицей, мессенджер и доска задач используют один материал и одни настройки.</p></div><Button variant="outline" onClick={()=>window.location.hash="blocks"}>Смотреть примеры<ArrowUpRight size={15} aria-hidden="true"/></Button></section><ToastViewport toasts={toast.toasts} onDismiss={toast.dismiss}/></>;
}
