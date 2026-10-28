import {t,localizeItems} from "../i18n/translate.js";
import {localeHref} from "../i18n/language.js";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Check, ChevronDown, Copy, Download, Folder, Heart, Plus, Settings2, Trash2, TrendingUp, Users } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, Input, Select, Switch, Textarea } from "../components/ui";
import { glassMaterials } from "../components/ui/glass.jsx";
import { Example } from "./Example.jsx";

export function ButtonsPage() {
  const [last, setLast] = useState("");
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const variants = [["primary", "Основная"], ["secondary", "Вторичная"], ["outline", "Контурная"], ["ghost", "Тихая"], ["destructive", "Удалить"], ["link", "Ссылка"]];
  function demonstrateLoading() {
    setPending(true); setDone(false);
    timer.current = window.setTimeout(() => { setPending(false); setDone(true); }, 1100);
  }
  return <>
    <Example id="variants" title={t("Варианты")} description={t("Шесть уровней акцента для разных действий.")} code={'import { Button } from "./components/ui";\n\n<Button>Основная</Button>\n<Button variant="secondary">Вторичная</Button>\n<Button variant="outline">Контурная</Button>\n<Button variant="ghost">Тихая</Button>\n<Button variant="destructive">Удалить</Button>\n<Button variant="link">Ссылка</Button>'}>
      <div className="demo-stack"><div className="demo-row">{variants.map(([variant, label]) => <Button key={variant} variant={variant} onClick={() => setLast(label)}>{t(label)}</Button>)}</div><p className="demo-feedback" role="status">{t(last ? "Нажата: " + last : "Один материал. Разная выразительность.")}</p></div>
    </Example>
    <Example id="sizes" title={t("Размеры и иконки")} description={t("Одинаковая геометрия в компактных и просторных интерфейсах.")} code={'import { Plus, ArrowRight, Heart } from "lucide-react";\nimport { Button } from "./components/ui";\n\n<Button size="sm">Маленькая</Button>\n<Button>Обычная</Button>\n<Button size="lg">Большая <ArrowRight size={16} /></Button>\n<Button size="icon" variant="outline" aria-label="Добавить"><Plus size={18} /></Button>'}>
      <div className="demo-stack"><div className="demo-row demo-row-align"><Button size="sm" onClick={() => setLast("Маленькая")}>{t("Маленькая")}</Button><Button onClick={() => setLast("Обычная")}>{t("Обычная")}</Button><Button size="lg" onClick={() => setLast("Большая")}>{t("Большая ")}<ArrowRight size={17} aria-hidden="true" /></Button></div><div className="demo-row"><Button size="icon" variant="outline" aria-label={t("Добавить")} onClick={() => setLast("Добавить")}><Plus size={18} aria-hidden="true" /></Button><Button size="icon" variant="outline" aria-label={t("Избранное")} aria-pressed={liked} className={liked ? "is-favorite" : ""} onClick={() => setLiked(!liked)}><Heart size={18} fill={liked ? "currentColor" : "none"} aria-hidden="true" /></Button><Button variant="ghost" onClick={() => setLast("Скачать")}><Download size={16} aria-hidden="true" />{t("Скачать")}</Button></div></div>
    </Example>
    <Example id="states" title={t("Состояния")} description={t("Ожидание, завершение и недоступное действие остаются частью одного языка.")} code={'import { Button } from "./components/ui";\n\n<Button loading={pending} onClick={save}>\n  {pending ? "Выполняется" : "Запустить пример"}\n</Button>\n<Button disabled>Недоступна</Button>'}>
      <div className="demo-stack"><div className="demo-row"><Button loading={pending} onClick={demonstrateLoading}>{t(pending ? "Выполняется" : done ? <><Check size={16} aria-hidden="true" />{t("Повторить")}</> : "Запустить пример")}</Button><Button disabled>{t("Недоступна")}</Button><Button variant="outline" disabled>{t("Недоступна")}</Button></div><p role="status" className="demo-feedback">{t(pending ? "Демонстрация состояния ожидания…" : done ? "Пример выполнен. Можно повторить." : "Нажмите, чтобы увидеть состояние ожидания.")}</p></div>
    </Example>
  </>;
}

export function FieldsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [applied, setApplied] = useState(false);
  const [region, setRegion] = useState("moscow");
  const [updates, setUpdates] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [invalid, setInvalid] = useState("hello@");
  const [isInvalid, setIsInvalid] = useState(true);
  const fieldRefs = useRef({});
  function change(key, value) { setForm({ ...form, [key]: value }); setErrors({ ...errors, [key]: "" }); setApplied(false); }
  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Введите имя.";
    if (!form.email || !event.currentTarget.elements.email.validity.valid) next.email = "Введите корректную почту.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) fieldRefs.current[first]?.focus();
    else setApplied(true);
  }
  return <>
    <Example id="form" title={t("Форма")} description={t("Подпись, поле и подсказка образуют единый блок.")} code={'import { Button, Input, Textarea } from "./components/ui";\n\n<form onSubmit={handleSubmit}>\n  <label htmlFor="name">Имя</label>\n  <Input id="name" name="name" autoComplete="name" />\n  <label htmlFor="email">Почта</label>\n  <Input id="email" name="email" type="email" />\n  <label htmlFor="message">Сообщение</label>\n  <Textarea id="message" rows={3} />\n  <Button type="submit">Применить</Button>\n</form>'}>
      <form className="demo-form" noValidate onSubmit={submit}>
        <div className="two-fields"><div className="demo-field"><label htmlFor="demo-name">{t("Имя")}</label><Input id="demo-name" name="name" ref={(node) => { fieldRefs.current.name = node; }} placeholder={t("Как к вам обращаться")} autoComplete="name" value={form.name} onChange={(event) => change("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "demo-name-error" : undefined} />{errors.name && <span className="field-error" id="demo-name-error">{t(errors.name)}</span>}</div><div className="demo-field"><label htmlFor="demo-email">{t("Почта")}</label><Input id="demo-email" name="email" ref={(node) => { fieldRefs.current.email = node; }} type="email" placeholder="hello@example.com" autoComplete="email" value={form.email} onChange={(event) => change("email", event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "demo-email-error" : undefined} />{errors.email && <span className="field-error" id="demo-email-error">{t(errors.email)}</span>}</div></div>
        <div className="demo-field"><label htmlFor="demo-message">{t("Сообщение ")}<span className="optional-label">{t("необязательно")}</span></label><Textarea id="demo-message" rows={3} placeholder={t("Несколько слов о вашей идее")} value={form.message} onChange={(event) => change("message", event.target.value)} /></div>
        <div className="form-actions"><p role="status" className="demo-feedback">{t(applied ? "Данные формы приняты в примере." : "Все поля доступны с клавиатуры.")}</p><Button type="submit">{t("Применить")}<ArrowUpRight size={16} aria-hidden="true" /></Button></div>
      </form>
    </Example>
    <Example id="field-states" title={t("Состояния полей")} description={t("Ошибка видна рядом с полем. Её можно исправить прямо в примере.")} code={'import { Input } from "./components/ui";\n\n<Input placeholder="Обычное поле" />\n<Input disabled value="Недоступно" readOnly />\n<Input readOnly value="Только чтение" />\n<Input type="email" aria-invalid={invalid} aria-describedby="error" />\n<span id="error">Проверьте адрес почты.</span>'}>
      <div className="field-state-grid"><div className="demo-field"><label htmlFor="state-default">{t("Обычное")}</label><Input id="state-default" placeholder={t("Введите текст")} /></div><div className="demo-field"><label htmlFor="state-readonly">{t("Только чтение")}</label><Input id="state-readonly" value="Пример" readOnly /></div><div className="demo-field"><label htmlFor="state-disabled">{t("Недоступное")}</label><Input id="state-disabled" value="Недоступно" disabled readOnly /></div><div className="demo-field"><label htmlFor="state-invalid">{t("С ошибкой")}</label><Input id="state-invalid" type="email" value={invalid} aria-invalid={isInvalid} aria-describedby="state-invalid-help" onChange={(event) => { setInvalid(event.target.value); setIsInvalid(!event.target.value || !event.target.validity.valid); }} /><span id="state-invalid-help" className={isInvalid ? "field-error" : "field-hint"}>{t(isInvalid ? "Проверьте адрес почты." : "Теперь адрес корректен.")}</span></div></div>
    </Example>
    <Example id="selection" title={t("Выбор и переключение")} description={t("Список, флажок и переключатель используют ту же тонкую поверхность.")} code={'import { Select, Checkbox, Switch } from "./components/ui";\n\n<Select items={regions} value={region} onValueChange={setRegion} />\n<Checkbox id="agreement" checked={accepted} onCheckedChange={setAccepted} />\n<label htmlFor="agreement">Принимаю условия примера</label>\n<Switch id="updates" checked={updates} onCheckedChange={setUpdates} />\n<label htmlFor="updates">Обновления</label>'}>
      <div className="demo-form selection-demo"><div className="demo-field"><label htmlFor="demo-region" id="region-label">{t("Регион")}</label><Select id="demo-region" aria-labelledby="region-label" items={localizeItems([{value:"moscow",label:"Москва"},{value:"petersburg",label:"Санкт-Петербург"},{value:"other",label:"Другой регион"}])} value={region} onValueChange={setRegion} /></div><div className="selection-line"><Checkbox id="demo-agreement" checked={accepted} onCheckedChange={setAccepted} /><label htmlFor="demo-agreement">{t("Принимаю условия примера")}</label></div><div className="selection-line selection-between"><div><label htmlFor="demo-updates">{t("Обновления")}</label><p>{t("Только важные изменения")}</p></div><Switch id="demo-updates" checked={updates} onCheckedChange={setUpdates} /></div><p className="demo-feedback" role="status">{t(accepted ? "Флажок установлен." : "Флажок не установлен.")} {t(updates ? "Обновления включены." : "Обновления выключены.")}</p></div>
    </Example>
  </>;
}

export function MenusPage({ openSearch }) {
  const [action, setAction] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [details, setDetails] = useState(false);
  const [sort, setSort] = useState("recent");
  return <>
    <Example id="actions" title={t("Меню действий")} description={t("Группы, иконки и отдельный акцент для осторожных действий.")} code={'import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button } from "./components/ui";\n\n<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="outline" />}>Действия</DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem onClick={edit}>Редактировать</DropdownMenuItem>\n    <DropdownMenuItem onClick={duplicate}>Дублировать</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>'}>
      <div className="demo-stack"><DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" />}>{t("Действия")}<ChevronDown size={16} aria-hidden="true" /></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuGroup><DropdownMenuLabel>{t("Элемент")}</DropdownMenuLabel><DropdownMenuItem onClick={() => setAction("Редактировать")}><Settings2 size={16} />{t("Редактировать")}</DropdownMenuItem><DropdownMenuItem onClick={() => setAction("Дублировать")}><Copy size={16} />{t("Дублировать")}</DropdownMenuItem><DropdownMenuItem disabled><Users size={16} />{t("Поделиться")}</DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuItem className="menu-destructive" onClick={() => setAction("Архивировать")}><Trash2 size={16} />{t("Архивировать")}</DropdownMenuItem></DropdownMenuContent></DropdownMenu><p className="demo-feedback" role="status">{t(action ? "Выбрано действие: " + action : "Нажмите, чтобы открыть меню.")}</p></div>
    </Example>
    <Example id="preferences" title={t("Меню с выбором")} description={t("Настройки и сортировка сохраняют состояние, пока вы изучаете пример.")} code={'import { DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "./components/ui";\n\n<DropdownMenuCheckboxItem checked={notifications} onCheckedChange={setNotifications}>\n  Уведомления\n</DropdownMenuCheckboxItem>\n<DropdownMenuRadioGroup value={sort} onValueChange={setSort}>\n  <DropdownMenuRadioItem value="recent">Сначала новые</DropdownMenuRadioItem>\n  <DropdownMenuRadioItem value="name">По названию</DropdownMenuRadioItem>\n</DropdownMenuRadioGroup>'}>
      <div className="demo-stack"><DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" />}><ListSettingsIcon />{t("Настроить вид")}<ChevronDown size={16} aria-hidden="true" /></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuGroup><DropdownMenuLabel>{t("Показывать")}</DropdownMenuLabel><DropdownMenuCheckboxItem checked={notifications} onCheckedChange={setNotifications}>{t("Уведомления")}</DropdownMenuCheckboxItem><DropdownMenuCheckboxItem checked={details} onCheckedChange={setDetails}>{t("Подробности")}</DropdownMenuCheckboxItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuRadioGroup value={sort} onValueChange={setSort}><DropdownMenuLabel>{t("Сортировка")}</DropdownMenuLabel><DropdownMenuRadioItem value="recent">{t("Сначала новые")}</DropdownMenuRadioItem><DropdownMenuRadioItem value="name">{t("По названию")}</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu><p className="demo-feedback" role="status">{t(notifications ? "Уведомления видны" : "Уведомления скрыты")} · {t(details ? "с подробностями" : "краткий вид")} · {t(sort === "recent" ? "сначала новые" : "по названию")}</p></div>
    </Example>
    <Example id="command" title={t("Командная палитра")} description={t("Быстрый переход к компоненту. Поиск работает и по русским, и по английским названиям.")} code={'<Button variant="outline" onClick={() => setSearchOpen(true)}>\n  Найти компонент\n</Button>\n\n// Ctrl / Cmd + K также открывает поиск.'}>
      <div className="demo-stack"><Button variant="outline" onClick={openSearch}>{t("Найти компонент")}<kbd>⌘ K</kbd></Button><p className="demo-feedback">{t("Стрелки — выбор. Enter — переход. Escape — закрытие.")}</p></div>
    </Example>
  </>;
}

function ListSettingsIcon() { return <Settings2 size={16} aria-hidden="true" />; }

export function CardsPage() {
  const [expanded,setExpanded]=useState(false);
  const [density,setDensity]=useState("comfortable");
  const [chosen,setChosen]=useState("list");
  return <>
    <Example id="project" title={t("Карточка с действием")} description={t("Заголовок, короткий текст и одно понятное действие.")} code={'import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "./components/ui";\n\n<Card>\n  <CardHeader>\n    <CardTitle>Тихий свет</CardTitle>\n    <CardDescription>Небольшой фрагмент содержания.</CardDescription>\n  </CardHeader>\n  <CardContent>Короткий текст с ясной иерархией.</CardContent>\n  <CardFooter><Button variant="outline">Показать детали</Button></CardFooter>\n</Card>'}>
      <Card className="content-card"><CardHeader><div className="card-topline"><Folder size={21} strokeWidth={1.6} aria-hidden="true"/><span className="badge">{t("Пример")}</span></div><CardTitle>{t("Тихий свет")}</CardTitle><CardDescription>{t("Небольшой фрагмент содержания.")}</CardDescription></CardHeader><CardContent><p className="content-summary">{t("Короткое описание, спокойный ритм и достаточно пространства для главного.")}</p>{expanded && <p className="content-detail" role="status">{t("Дополнительный текст раскрывается внутри той же поверхности. Контент определяет композицию, а материал поддерживает его.")}</p>}</CardContent><CardFooter><Button variant="outline" className="full-width" onClick={()=>setExpanded(!expanded)}>{t(expanded?"Скрыть детали":"Показать детали")}<ArrowUpRight size={16} aria-hidden="true"/></Button></CardFooter></Card>
    </Example>
    <Example id="metrics" title={t("Поверхности стекла")} description={t("Четыре отделки одного материала: прозрачность, рассеивание, перелив и оттенок.")} code={'<Card surface="air">Воздух</Card>\n<Card surface="frost">Иней</Card>\n<Card surface="prism">Призма</Card>\n<Card surface="smoke">Дымка</Card>'}>
      <div className="surface-example"><div role="group" aria-label={t("Плотность карточек")} className="segmented"><button aria-pressed={density==="compact"} onClick={()=>setDensity("compact")}>{t("Компактно")}</button><button aria-pressed={density==="comfortable"} onClick={()=>setDensity("comfortable")}>{t("Свободно")}</button></div><div className="surface-grid glass-material-grid" data-density={density}>{glassMaterials.map((material,index)=><Card key={material.id} surface={material.id}><CardHeader><span className="material-number">0{t(index+1)}</span><CardTitle>{t(material.name)}</CardTitle><CardDescription>{t(material.description)}</CardDescription></CardHeader><span className="material-detail">{t("Тонкая кромка · мягкий свет")}</span></Card>)}</div><a className="material-context-link" href={localeHref("/examples/tasks")}>{t("Сравнить на доске задач")}<ArrowUpRight size={14} aria-hidden="true"/></a><p className="demo-feedback" role="status">{t(density==="compact"?"Компактная плотность.":"Свободная плотность.")}</p></div>
    </Example>
    <Example id="select-card" title={t("Выбор карточки")} description={t("Выбор обозначен тонкой границей и ясным состоянием кнопки.")} code={'<Card data-selected={selected}>\n  <CardTitle>Список</CardTitle>\n  <CardDescription>Содержание в спокойном ритме.</CardDescription>\n  <Button variant="outline" aria-pressed={selected} onClick={select}>\n    {selected ? "Выбрано" : "Выбрать"}\n  </Button>\n</Card>'}>
      <div className="choice-grid">{[{id:"list",title:"Список",text:"Содержание в спокойном ритме.",icon:Folder},{id:"tiles",title:"Плитка",text:"Отдельный акцент на каждом элементе.",icon:PanelsIcon}].map(({id,title,text,icon:Icon})=><Card key={id} className="choice-card" data-selected={chosen===id||undefined}><CardHeader><Icon size={21} strokeWidth={1.6} aria-hidden="true"/><CardTitle>{t(title)}</CardTitle><CardDescription>{t(text)}</CardDescription></CardHeader><CardFooter><Button variant={chosen===id?"secondary":"outline"} className="full-width" aria-pressed={chosen===id} onClick={()=>setChosen(id)}>{t(chosen===id?<><Check size={15} aria-hidden="true"/>{t("Выбрано")}</>:"Выбрать")}</Button></CardFooter></Card>)}</div>
    </Example>
  </>;
}
function PanelsIcon(props) { return <Folder {...props}/>; }
