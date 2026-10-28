import {t,localizeItems,message} from "../i18n/translate.js";
import {useLanguage} from '../i18n/language.js';
import {localeHref} from "../i18n/language.js";
import {localizedNumberFormat,localizedDateFormat,localizedPluralRules} from "../i18n/format.js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Layers2, MessageCircle, Moon, Plus, Search, Send, Sun } from "lucide-react";
import { Button, Card, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, Input, Select, Textarea } from "../components/ui";
import "./examples.css";
import { TaskBoard,taskText } from "./TaskBoard.jsx";
import { PreviewControls } from "../preview/PreviewControls.jsx";

export function ExampleShell({kind,children}) {
  const language=useLanguage();
  useEffect(()=>{document.title=t({messenger:"Мессенджер",tasks:"Тасктрекер",dashboard:"Обзор"}[kind])+" — tenvell";},[kind,language]);
  return <div className="example-app">
    <header className="example-app-header">
      <a className="example-back" href={localeHref("/#buttons")} aria-label={t("tenvell: каталог компонентов")}><ArrowLeft size={17} aria-hidden="true"/>tenvell</a>
      <nav aria-label={t("Примеры интерфейсов")}><a href={localeHref("/examples/dashboard")} aria-current={kind==="dashboard"?"page":undefined}>{t("Обзор")}</a><a href={localeHref("/examples/messenger")} aria-current={kind==="messenger"?"page":undefined}>{t("Мессенджер")}</a><a href={localeHref("/examples/tasks")} aria-current={kind==="tasks"?"page":undefined}>{t("Тасктрекер")}</a></nav>
      <div className="example-header-end"><span className="demo-badge">{t("Демо")}</span><PreviewControls/></div>
    </header>{children}
  </div>;
}

const conversations=[
  {id:"general",title:"Общее",subtitle:"Демонстрационная переписка",unread:2},
  {id:"ideas",title:"Идеи",subtitle:"Место для коротких мыслей",unread:1},
  {id:"notes",title:"Заметки",subtitle:"Сохранённое для себя",unread:0},
];
const initialMessages={
  general:[{id:1,author:"Лина",text:"Привет! Смотрим, как компоненты работают вместе.",time:"10:24"},{id:2,author:"Вы",text:"Да. Оставим в интерфейсе только главное.",time:"10:26",mine:true},{id:3,author:"Илья",text:"Проверим ещё длинные сообщения и небольшой экран.",time:"10:29"}],
  ideas:[{id:1,author:"Илья",text:"Можно собрать небольшую коллекцию примеров: диалог, список и доску.",time:"09:40"},{id:2,author:"Вы",text:"Так будет проще увидеть общий характер компонентов.",time:"09:44",mine:true}],
  notes:[{id:1,author:"Вы",text:"Простота — это ясная иерархия, удобные состояния и достаточно пространства.",time:"08:15",mine:true}],
};
function messageCount(count){const last=count%10,lastTwo=count%100;return count+" "+(last===1&&lastTwo!==11?"сообщение":last>=2&&last<=4&&(lastTwo<12||lastTwo>14)?"сообщения":"сообщений");}

export function MessengerExample() {
  const [selected,setSelected]=useState("general");
  const [messages,setMessages]=useState(()=>Object.fromEntries(Object.entries(initialMessages).map(([id,rows])=>[id,rows.map(row=>({...row,demo:true}))])));
  const [unread,setUnread]=useState({general:0,ideas:1,notes:0});
  const [drafts,setDrafts]=useState({});
  const [query,setQuery]=useState("");
  const [mobileChat,setMobileChat]=useState(false);
  const [notice,setNotice]=useState("");
  const scrollRef=useRef(null),composerRef=useRef(null),idRef=useRef(100),conversationRefs=useRef({}),searchRef=useRef(null),restoreListFocus=useRef(false);
  const chat=conversations.find(item=>item.id===selected),draft=drafts[selected]||"";
  const visible=conversations.filter(item=>(item.title+" "+t(item.title)).toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru").trim()));
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},[selected,messages]);
  useLayoutEffect(()=>{if(mobileChat){composerRef.current?.focus({preventScroll:true});}else if(restoreListFocus.current){restoreListFocus.current=false;(conversationRefs.current[selected]||searchRef.current)?.focus({preventScroll:true});}},[mobileChat,selected]);
  function choose(id){setSelected(id);setUnread(current=>({...current,[id]:0}));setMobileChat(true);setNotice("");}
  function backToList(){restoreListFocus.current=true;setMobileChat(false);}
  function send(event){
    event?.preventDefault();if(!draft.trim())return;
    const message={id:idRef.current++,author:"Вы",text:draft.trim(),time:localizedDateFormat({hour:"2-digit",minute:"2-digit",timeZone:"Europe/Moscow"}).format(new Date()),mine:true};
    setMessages(current=>({...current,[selected]:[...current[selected],message]}));
    setDrafts(current=>({...current,[selected]:""}));setNotice("Сообщение добавлено в демонстрацию.");composerRef.current?.focus();
  }
  return <ExampleShell kind="messenger"><main className="example-screen-wrap">
    <div className="screen-intro"><div><span className="screen-eyebrow">{t("Пример интерфейса")}</span><h1>{t("Мессенджер")}</h1></div><p>{t("Список, диалог и действие — в одном спокойном пространстве.")}</p></div>
    <div className="messenger-frame" data-mobile-chat={mobileChat||undefined}>
      <aside className="conversation-sidebar" aria-label={t("Диалоги")}>
        <div className="conversation-heading"><h2>{t("Диалоги")}</h2><span>{t(conversations.length)}</span></div>
        <div className="conversation-search"><Search size={16} aria-hidden="true"/><Input ref={searchRef} type="search" aria-label={t("Поиск диалогов")} placeholder={t("Поиск")} value={query} onChange={event=>setQuery(event.target.value)}/></div>
        <div className="conversation-list">{visible.length?visible.map(item=>{const last=messages[item.id].at(-1);return <button key={item.id} className="conversation-item" ref={node=>{conversationRefs.current[item.id]=node;}} aria-pressed={selected===item.id} onClick={()=>choose(item.id)}><span className="conversation-symbol"><MessageCircle size={20} strokeWidth={1.5} aria-hidden="true"/></span><span className="conversation-copy"><strong>{t(item.title)}</strong><span>{last.demo?t(last.text):last.text}</span></span><span className="conversation-meta"><time>{t(last.time)}</time>{unread[item.id]>0&&<span className="unread-count">{t(unread[item.id])}</span>}</span></button>;}):<div className="conversation-empty"><p>{t("Диалоги не найдены")}</p><Button variant="ghost" size="sm" onClick={()=>setQuery("")}>{t("Сбросить поиск")}</Button></div>}</div>
        <p className="conversation-footnote"><Layers2 size={14} aria-hidden="true"/>{t("Демонстрационные данные")}</p>
      </aside>
      <section className="chat-panel" aria-label={t("Диалог "+chat.title)}>
        <header className="chat-header"><Button variant="icon" size="icon" className="chat-back" aria-label={t("К списку диалогов")} onClick={backToList}><ChevronLeft size={21} aria-hidden="true"/></Button><div><h2>{t(chat.title)}</h2><p>{t(chat.subtitle)}</p></div><span className="chat-counter">{t(messageCount(messages[selected].length))}</span></header>
        <div className="message-list" ref={scrollRef} aria-label={t("Сообщения")}><span className="message-date">{t("27 октября")}</span>{messages[selected].map(message=><div className={"message-row"+(message.mine?" own":"")} key={message.id}><div className="message-bubble">{!message.mine&&<span className="message-author">{t(message.author)}</span>}<p>{message.demo?t(message.text):message.text}</p><time>{t(message.time)}</time></div></div>)}</div>
        <form className="message-composer" onSubmit={send}><Textarea ref={composerRef} rows={1} maxLength={1000} aria-label={t("Сообщение")} placeholder={t("Написать сообщение…")} value={draft} onChange={event=>setDrafts(current=>({...current,[selected]:event.target.value}))} onKeyDown={event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();send();}}}/><Button type="submit" size="icon" disabled={!draft.trim()} aria-label={t("Отправить сообщение")}><Send size={18} strokeWidth={1.6} aria-hidden="true"/></Button></form>
        <p className="message-feedback" role="status">{t(notice||"Сообщения остаются в этом демонстрационном примере.")}</p>
      </section>
    </div>
  </main></ExampleShell>;
}

const columns=[{id:"todo",title:"К выполнению"},{id:"doing",title:"В работе"},{id:"done",title:"Готово"}];
const seedTasks=[
  {id:1,title:"Уточнить текст",description:"Сделать формулировки короче и яснее.",status:"todo",tag:"Текст"},
  {id:2,title:"Проверить мобильный экран",description:"Посмотреть композицию на небольшой ширине.",status:"todo",tag:"Проверка"},
  {id:3,title:"Собрать палитру",description:"Согласовать поверхности и состояния.",status:"doing",tag:"Дизайн"},
  {id:4,title:"Подготовить макет",description:"Уточнить ритм и основные отступы.",status:"doing",tag:"Дизайн"},
  {id:5,title:"Проверить контраст",description:"Сравнить светлую и тёмную темы.",status:"done",tag:"Проверка"},
  {id:6,title:"Согласовать детали",description:"Сохранить единый характер компонентов.",status:"done",tag:"Детали"},
];

export function TaskTrackerExample(){
  const [tasks,setTasks]=useState(()=>seedTasks.map(task=>({...task,demo:true}))),[query,setQuery]=useState(""),[filter,setFilter]=useState("all");
  const [open,setOpen]=useState(false),[draft,setDraft]=useState({title:"",description:"",status:"todo"}),[error,setError]=useState("");
  const [notice,setNotice]=useState(""),[moved,setMoved]=useState(null);
  const titleRef=useRef(null),cardRefs=useRef({}),idRef=useRef(7),filterRef=useRef(null);
  useEffect(()=>{if(moved){const card=cardRefs.current[moved.id];const target=(moved.focus==="handle"?card?.querySelector("[data-drag-handle]"):card)||filterRef.current?.querySelector('[aria-pressed="true"]');target?.focus();const timer=setTimeout(()=>setMoved(null),1400);return()=>clearTimeout(timer);}},[moved]);
  const isTaskShown=task=>(filter==="all"||filter==="active"&&task.status!=="done"||filter==="done"&&task.status==="done")&&(task.title+" "+task.description+" "+taskText(task)+" "+taskText(task,"description")).toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"));
  function move(task){const next=task.status==="todo"?"doing":task.status==="doing"?"done":"todo";setTasks(current=>current.map(item=>item.id===task.id?{...item,status:next}:item));setMoved({id:task.id});setNotice(message("Задача «{title}» перемещена: {column}.",{title:task.demo?message(task.title):task.title,column:message(columns.find(item=>item.id===next).title)}));}
  function changeOpen(next){setOpen(next);if(next){setDraft({title:"",description:"",status:"todo"});setError("");}}
  function create(event){
    event.preventDefault();if(!draft.title.trim()){setError("Введите название задачи.");titleRef.current?.focus();return;}
    const created={id:idRef.current++,title:draft.title.trim(),description:draft.description.trim(),status:draft.status,tag:"Новая"};
    setTasks(current=>[created,...current]);
    setOpen(false);setQuery("");setFilter("all");setNotice(message("Добавлена задача «{title}».",{title:draft.title.trim()}));
  }
  return <ExampleShell kind="tasks"><main className="example-screen-wrap">
    <div className="screen-intro"><div><span className="screen-eyebrow">{t("Пример интерфейса")}</span><h1>{t("Задачи")}</h1></div><p>{t(tasks.filter(item=>item.status==="done").length)}{t(" из ")}{t(tasks.length)}{t(" готово · демонстрационная доска")}</p></div>
    <div className="task-toolbar">
      <div className="segmented" ref={filterRef} role="group" aria-label={t("Фильтр задач")}>{[["all","Все"],["active","Активные"],["done","Готовые"]].map(([value,label])=><button key={value} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{t(label)}</button>)}</div>
      <div className="task-search"><Search size={16} aria-hidden="true"/><Input type="search" aria-label={t("Поиск задач")} placeholder={t("Найти задачу")} value={query} onChange={event=>setQuery(event.target.value)}/></div>
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogTrigger render={<Button/>}><Plus size={17} aria-hidden="true"/>{t("Новая задача")}</DialogTrigger>
        <DialogContent className="catalog-dialog"><form onSubmit={create} noValidate>
          <DialogTitle>{t("Новая задача")}</DialogTitle><DialogDescription>{t("Название, детали и начальное состояние.")}</DialogDescription>
          <div className="modal-fields">
            <div className="demo-field"><label htmlFor="new-task-title">{t("Название")}</label><Input id="new-task-title" ref={titleRef} maxLength={90} value={draft.title} aria-invalid={!!error} aria-describedby={error?"new-task-error":undefined} onChange={event=>{setDraft({...draft,title:event.target.value});if(event.target.value.trim())setError("");}}/>{error&&<p className="field-error" id="new-task-error" role="alert">{t(error)}</p>}</div>
            <div className="demo-field"><label htmlFor="new-task-description">{t("Описание")}</label><Textarea id="new-task-description" rows={3} maxLength={300} value={draft.description} onChange={event=>setDraft({...draft,description:event.target.value})}/></div>
            <div className="demo-field"><label id="new-task-status-label" htmlFor="new-task-status">{t("Состояние")}</label><Select id="new-task-status" aria-labelledby="new-task-status-label" items={localizeItems(columns.map(item=>({value:item.id,label:item.title})))} value={draft.status} onValueChange={status=>setDraft({...draft,status})}/></div>
          </div>
          <div className="modal-footer"><DialogClose render={<Button variant="ghost"/>}>{t("Отмена")}</DialogClose><Button type="submit">{t("Создать")}</Button></div>
        </form></DialogContent>
      </Dialog>
    </div>
    <TaskBoard tasks={tasks} columns={columns} isTaskShown={isTaskShown} cardRefs={cardRefs} onMove={move} moved={moved} onFinish={({tasks:next,id,keyboard,changed,cancelled})=>{
      if(changed&&!cancelled)setTasks(next);
      setMoved({id,focus:keyboard?"handle":"card"});
      const task=next.find(item=>item.id===id),before=tasks.find(item=>item.id===id);
      setNotice(cancelled?"Перемещение отменено.":!changed?"Позиция карточки не изменилась.":task.status===before.status?"Порядок карточек обновлён.":message("Задача «{title}» перемещена: {column}.",{title:task.demo?message(task.title):task.title,column:message(columns.find(column=>column.id===task.status).title)}));
    }}/>
    <p className="task-board-feedback" role="status">{t(notice||"Это самостоятельный пример: изменения сохраняются только в текущем просмотре.")}</p>
  </main></ExampleShell>;
}

