import {getLanguage} from '../i18n/language.js';
import {t} from "../i18n/translate.js";
import { useRef, useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { ArrowUpRight, Check, FileText, Settings2, ShieldCheck, X } from "lucide-react";
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, Input, Switch } from "../components/ui";
import { Example } from "./Example.jsx";

function SettingsExample() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(()=>({ name: getLanguage()==='en'?'Example':'Пример', notifications: true }));
  const [draft, setDraft] = useState(saved);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  function changeOpen(next) { setDraft(saved); setError(""); setOpen(next); }
  function save(event) {
    event.preventDefault();
    if (!draft.name.trim()) { setError("Введите название."); nameRef.current?.focus(); return; }
    const next = { ...draft, name: draft.name.trim() };
    setSaved(next); setDraft(next); setOpen(false); setApplied(true);
  }
  return <div className="demo-stack">
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger render={<Button variant="outline" />}><Settings2 size={16} aria-hidden="true" />{t("Открыть настройки")}</DialogTrigger>
      <DialogContent className="catalog-dialog" initialFocus={titleRef}>
        <form onSubmit={save} noValidate>
          <DialogTitle ref={titleRef} tabIndex={-1}>{t("Настройки образца")}</DialogTitle>
          <DialogDescription>{t("Название и важные уведомления.")}</DialogDescription>
          <DialogClose render={<Button variant="icon" className="panel-close" aria-label={t("Закрыть настройки образца")} />}><X strokeWidth={1.2} aria-hidden="true" /></DialogClose>
          <div className="modal-fields"><div className="demo-field"><label htmlFor="modal-workspace">{t("Название")}</label><Input id="modal-workspace" ref={nameRef} value={draft.name} maxLength={64} aria-invalid={!!error} aria-describedby={error ? "modal-name-error" : undefined} onChange={(event) => { setDraft({ ...draft, name: event.target.value }); if (event.target.value.trim()) setError(""); }} />{error && <p id="modal-name-error" className="field-error" role="alert">{t(error)}</p>}</div><div className="selection-line selection-between"><div><label htmlFor="modal-updates">{t("Уведомления")}</label><p>{t("Только важные события")}</p></div><Switch id="modal-updates" checked={draft.notifications} onCheckedChange={(notifications) => setDraft({ ...draft, notifications })} /></div></div>
          <div className="modal-footer"><DialogClose render={<Button variant="ghost" />}>{t("Отмена")}</DialogClose><Button type="submit">{t("Сохранить")}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
    <p className="demo-feedback" role="status">{applied?t("Применено: {name} · {notifications}",{name:saved.name,notifications:t(saved.notifications?"уведомления включены":"уведомления выключены")}):t("Фокус остаётся внутри окна и возвращается к кнопке.")}</p>
  </div>;
}

function ConfirmationExample() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const cancelRef = useRef(null);
  return <div className="demo-stack">
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger render={<Button variant="outline" />}><ShieldCheck size={16} aria-hidden="true" />{t("Подтвердить действие")}</AlertDialog.Trigger>
      <AlertDialog.Portal><AlertDialog.Backdrop className="dialog-backdrop confirm-backdrop" /><AlertDialog.Popup className="glass-panel catalog-dialog confirmation-dialog" initialFocus={cancelRef}>
        <span className="dialog-symbol"><ShieldCheck size={24} strokeWidth={1.5} aria-hidden="true" /></span>
        <AlertDialog.Title className="panel-title">{t("Продолжить действие?")}</AlertDialog.Title>
        <AlertDialog.Description className="panel-description">{t("Окно подтверждения помогает остановиться и принять осознанное решение.")}</AlertDialog.Description>
        <div className="modal-footer"><AlertDialog.Close ref={cancelRef} render={<Button variant="ghost" />}>{t("Отмена")}</AlertDialog.Close><Button onClick={() => { setCount(count + 1); setOpen(false); }}>{t("Подтвердить")}<Check size={16} aria-hidden="true" /></Button></div>
      </AlertDialog.Popup></AlertDialog.Portal>
    </AlertDialog.Root>
    <p className="demo-feedback" role="status">{t(count ? "Действие подтверждено: " + count : "Ничего не происходит без вашего подтверждения.")}</p>
  </div>;
}

function ScrollExample() {
  const heading = useRef(null);
  return <Dialog>
    <DialogTrigger render={<Button variant="outline" />}><FileText size={16} aria-hidden="true" />{t("Открыть длинное окно")}</DialogTrigger>
    <DialogContent className="catalog-dialog scroll-dialog" initialFocus={heading}>
      <DialogTitle ref={heading} tabIndex={-1}>{t("Принципы материала")}</DialogTitle>
      <DialogDescription>{t("Больше содержимого. Тот же ясный фокус.")}</DialogDescription>
      <DialogClose render={<Button variant="icon" className="panel-close" aria-label={t("Закрыть принципы материала")} />}><X strokeWidth={1.2} aria-hidden="true" /></DialogClose>
      <div className="dialog-scroll-region" tabIndex={0} aria-label={t("Текст принципов")}>
        {[
          ["Лёгкость", "Поверхность поддерживает содержание и не спорит с ним. Прозрачность оставляет ощущение пространства, а тонкая кромка обозначает границы."],
          ["Ясная иерархия", "Размер текста, интервалы и группировка помогают увидеть главное. Цвет и объём используются только там, где дают дополнительный смысл."],
          ["Предсказуемые действия", "Кнопки говорят, что произойдёт дальше. Отмена возвращает к предыдущему состоянию, а подтверждение явно завершает действие."],
          ["Читаемость", "Контраст текста остаётся достаточным на светлом и тёмном фоне. Размытие материала не затрагивает буквы и элементы управления."],
          ["Клавиатура", "Каждое действие доступно с клавиатуры. Видимый фокус помогает ориентироваться, а Escape закрывает временный слой."],
          ["Разные размеры", "Композиция сохраняет смысл на широком и узком экране. Длинное содержимое прокручивается, не перекрывая действия."],
          ["Сдержанное движение", "Переходы объясняют изменение состояния. Если пользователь предпочитает меньше движения, интерфейс уважает этот выбор."],
          ["Единый характер", "Кнопки, поля, карточки и графики используют общие цвета, скругления и интервалы. Их можно сочетать в разных продуктах."],
        ].map(([title, text]) => <section key={title}><h3>{t(title)}</h3><p>{t(text)}</p></section>)}
      </div>
      <div className="modal-footer"><DialogClose render={<Button />}>{t("Понятно")}<ArrowUpRight size={16} aria-hidden="true" /></DialogClose></div>
    </DialogContent>
  </Dialog>;
}

export function DialogsPage() {
  return <>
    <Example id="settings" title={t("Настройки")} description={t("Редактирование с сохранением, отменой и проверкой поля.")} code={'import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Button } from "./components/ui";\n\n<Dialog>\n  <DialogTrigger render={<Button />}>Открыть настройки</DialogTrigger>\n  <DialogContent className="catalog-dialog">\n    <DialogTitle>Настройки образца</DialogTitle>\n    <DialogDescription>Название и важные уведомления.</DialogDescription>\n    <DialogClose render={<Button variant="ghost" />}>Отмена</DialogClose>\n  </DialogContent>\n</Dialog>'}><SettingsExample /></Example>
    <Example id="confirmation" title={t("Подтверждение")} description={t("Первый фокус — на безопасном действии. Подтверждение всегда явно.")} code={'import { AlertDialog } from "@base-ui/react/alert-dialog";\nimport { Button } from "./components/ui";\n\n<AlertDialog.Root>\n  <AlertDialog.Trigger render={<Button />}>Продолжить</AlertDialog.Trigger>\n  <AlertDialog.Portal>\n    <AlertDialog.Popup className="glass-panel catalog-dialog">\n      <AlertDialog.Title>Продолжить действие?</AlertDialog.Title>\n      <AlertDialog.Close render={<Button />}>Отмена</AlertDialog.Close>\n    </AlertDialog.Popup>\n  </AlertDialog.Portal>\n</AlertDialog.Root>'}><ConfirmationExample /></Example>
    <Example id="scroll" title={t("Длинное содержимое")} description={t("Прокручивается текст; заголовок и действия остаются рядом.")} code={'<DialogContent className="catalog-dialog scroll-dialog">\n  <DialogTitle>Принципы материала</DialogTitle>\n  <div className="dialog-scroll-region" tabIndex={0}>\n    {content}\n  </div>\n  <div className="modal-footer">\n    <DialogClose render={<Button />}>Понятно</DialogClose>\n  </div>\n</DialogContent>'}><div className="demo-stack"><ScrollExample /><p className="demo-feedback">{t("Для инструкций, заметок и длинных форм.")}</p></div></Example>
  </>;
}
