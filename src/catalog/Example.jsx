import {t,localizeCode} from "../i18n/translate.js";
import { useEffect, useId, useState } from "react";
import { Check, Code2, Copy, Eye, LoaderCircle } from "lucide-react";

export function Example({ id, title, description, code, children, className = "", frameClassName = "" }) {
  const [view, setView] = useState("preview");
  const [copy, setCopy] = useState("idle");
  const uid = useId();
  const localizedCode=localizeCode(code);
  useEffect(() => {
    if (window.location.hash.split("/")[1] !== id) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [id]);
  useEffect(() => {
    if (copy === "idle" || copy === "pending") return;
    const timer = window.setTimeout(() => setCopy("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [copy]);

  async function copyCode() {
    setCopy("pending");
    try { await navigator.clipboard.writeText(localizedCode); setCopy("copied"); }
    catch { setCopy("error"); }
  }

  function tabKey(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "preview" : event.key === "End" ? "code" : view === "preview" ? "code" : "preview";
    setView(next);
    document.getElementById(`${uid}-${next}`)?.focus();
  }

  return <section id={id} className={`example-block ${className}`} data-example={id}>
    <div className="example-heading"><h2>{t(title)}</h2>{description && <p>{t(description)}</p>}</div>
    <div className={"example-frame "+frameClassName}>
      <div className="example-toolbar">
        <div role="tablist" aria-label={t('Вид примера: {title}',{title:t(title)})} className="example-tabs" onKeyDown={tabKey}>
          <button id={`${uid}-preview`} role="tab" aria-selected={view === "preview"} aria-controls={`${uid}-panel`} tabIndex={view === "preview" ? 0 : -1} onClick={() => setView("preview")}><Eye size={14} aria-hidden="true" />{t("Пример")}</button>
          <button id={`${uid}-code`} role="tab" aria-selected={view === "code"} aria-controls={`${uid}-panel`} tabIndex={view === "code" ? 0 : -1} onClick={() => setView("code")}><Code2 size={14} aria-hidden="true" />{t("Код")}</button>
        </div>
        <button className="copy-code" aria-label={t(`Скопировать код: ${title}`)} title={t("Скопировать код")} disabled={copy === "pending"} onClick={copyCode}>
          {copy === "copied" ? <Check size={15} /> : copy === "pending" ? <LoaderCircle size={15} className="button-spinner" /> : <Copy size={15} />}<span className={copy === "idle" ? "sr-only" : ""} role="status">{t(copy === "copied" ? "Скопировано" : copy === "error" ? "Не удалось скопировать" : copy === "pending" ? "Копируем" : "Скопировать")}</span>
        </button>
      </div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${view}`} className={view === "preview" ? "example-preview" : "example-code"} tabIndex={view === "code" ? 0 : undefined}>
        {view === "preview" ? children : <pre><code>{localizedCode}</code></pre>}
      </div>
    </div>
  </section>;
}
