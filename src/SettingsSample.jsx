import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { Button, Input } from "./components/ui/controls.jsx";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./components/ui/dialog.jsx";
import { PreviewControls } from "./preview/PreviewControls.jsx";
import { Switch } from "./components/ui/switch.jsx";

const initialSettings = { name: "Пример", notifications: true };
export function SettingsSample() {
  const [saved, setSaved] = useState(initialSettings);
  const [draft, setDraft] = useState(initialSettings);
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(false);
  const titleRef = useRef(null);
  const nameRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => { document.title = "Образец материала — tenvell"; }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(false), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function changeOpen(nextOpen) {
    setDraft(saved);
    setError("");
    setOpen(nextOpen);
    if (nextOpen) setNotice(false);
  }

  function applySettings(event) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setError("Введите название.");
      nameRef.current?.focus();
      return;
    }
    const nextSettings = { ...draft, name };
    setSaved(nextSettings);
    setDraft(nextSettings);
    setError("");
    setOpen(false);
    setNotice(true);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <main className="canvas" aria-label="Пространство">
        {!open&&<div className="sample-preview-bar"><PreviewControls/></div>}
        <div className="launcher" data-hidden={open || undefined}>
          <span className="launcher-eyebrow">tenvell · образец материала</span>
          <h1>{saved.name}</h1>
          <DialogTrigger ref={triggerRef} render={<Button className="reopen-button" />}>
            Открыть настройки <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />
          </DialogTrigger>
        </div>
      </main>

      <DialogContent initialFocus={titleRef} finalFocus={triggerRef}>
        <form onSubmit={applySettings} noValidate>
          <header className="panel-header">
            <DialogTitle ref={titleRef} tabIndex={-1}>Настройки</DialogTitle>
            <DialogDescription>Внешний вид и поведение интерфейса.</DialogDescription>
            <div className="sample-preview-controls"><PreviewControls/></div>
          </header>
          <DialogClose render={<Button variant="icon" className="panel-close" aria-label="Закрыть настройки" />}>
            <X aria-hidden="true" strokeWidth={1.6} />
          </DialogClose>

          <div className="panel-fields">
            <div className="field">
              <label htmlFor="workspace-name">Название</label>
              <Input
                ref={nameRef} id="workspace-name" name="workspaceName" value={draft.name}
                maxLength={64} autoComplete="off" aria-invalid={!!error}
                aria-describedby={error ? "name-error" : undefined}
                onChange={(event) => {
                  setDraft({ ...draft, name: event.target.value });
                  if (error && event.target.value.trim()) setError("");
                }}
              />
              {error && <p id="name-error" className="field-error" role="alert">{error}</p>}
            </div>

          </div>

          <div className="preference-row">
            <div className="preference-copy">
              <label htmlFor="notifications">Уведомления</label>
              <p id="notifications-description">Только важные события</p>
            </div>
            <Switch
              id="notifications" name="notifications" aria-describedby="notifications-description"
              checked={draft.notifications}
              onCheckedChange={(notifications) => setDraft({ ...draft, notifications })}
            />
          </div>

          <footer className="panel-footer">
            <DialogClose render={<Button variant="ghost" />}>Отмена</DialogClose>
            <Button type="submit">Сохранить</Button>
          </footer>
        </form>
      </DialogContent>

      {notice && <div className="notice" role="status"><Check size={18} aria-hidden="true" strokeWidth={1.8} />Изменения применены</div>}
    </Dialog>
  );
}
