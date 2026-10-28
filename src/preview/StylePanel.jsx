import {t,localizeItems} from "../i18n/translate.js";
import {localeHref} from "../i18n/language.js";
import {useRef,useState} from "react";
import {SlidersHorizontal} from "lucide-react";
import {Button,Input,Card,Badge,RadioGroup,Sheet,SheetContent,SheetDescription,SheetTitle,SheetTrigger} from "../components/ui";
import {setPreviewSetting,usePreviewSettings} from "./preferences.js";
import "./style-tokens.css";

const accents=[{value:"slate",label:"Графит",color:"#57616a"},{value:"blue",label:"Синий",color:"#3d6480"},{value:"violet",label:"Фиолетовый",color:"#6b5b83"},{value:"jade",label:"Зелёный",color:"#426e61"}];
export function StylePanel(){
  const prefs=usePreviewSettings(),titleRef=useRef(null);const[notice,setNotice]=useState("");
  function change(key,value){setPreviewSetting(key,value);setNotice("");}
  return <Sheet><SheetTrigger render={<Button type="button" variant="ghost" size="sm" className="preview-trigger" aria-label={t("Настроить стиль")} title={t("Акцент, скругление и плотность")}/>}><SlidersHorizontal size={16} strokeWidth={1.5} aria-hidden="true"/><span className="preview-control-label">{t("Стиль")}</span></SheetTrigger><SheetContent initialFocus={titleRef} className="style-panel"><SheetTitle ref={titleRef} tabIndex={-1}>{t("Характер интерфейса")}</SheetTitle><SheetDescription>{t("Настройки работают на всех основных экранах. Содержание остаётся на месте.")}</SheetDescription>
    <section className="style-option-section"><h3>{t("Акцент")}</h3><RadioGroup label={t("Цвет акцента")} className="style-accent-grid" value={prefs.accent} onValueChange={value=>change("accent",value)} items={localizeItems(accents.map(item=>({...item,label:<span className="style-accent-label"><span style={{background:item.color}} aria-hidden="true"/>{t(item.label)}</span>})))}/></section>
    <section className="style-option-section"><h3>{t("Скругление")}</h3><RadioGroup label={t("Скругление")} className="style-option-grid" value={prefs.radius} onValueChange={value=>change("radius",value)} items={localizeItems([{value:"strict",label:"Строже"},{value:"soft",label:"Мягко"},{value:"round",label:"Округло"}])}/></section>
    <section className="style-option-section"><h3>{t("Плотность")}</h3><RadioGroup label={t("Плотность интерфейса")} value={prefs.density} onValueChange={value=>change("density",value)} items={localizeItems([{value:"comfortable",label:"Свободно",description:"Больше пространства между элементами."},{value:"compact",label:"Компактно",description:"Больше содержания на экране."}])}/></section>
    <Card className="style-live-card"><Badge>{t("Пример")}</Badge><h3>{t("Карточка в выбранном стиле")}</h3><p>{t("Кнопки, поля и кромки используют общие настройки.")}</p><Input readOnly value="Короткий текст" aria-label={t("Образец поля")}/><Button onClick={()=>setNotice("Кнопка в выбранном стиле.")}>{t("Проверить")}</Button></Card>
    <div className="style-panel-footer"><Button variant="ghost" size="sm" onClick={()=>{setPreviewSetting("accent","slate");setPreviewSetting("radius","soft");setPreviewSetting("density","comfortable");setNotice("Параметры стиля сброшены.");}}>{t("Сбросить стиль")}</Button><a href={localeHref("/typeface.html")}>Lamina UI</a></div><p className="style-notice" role="status">{t(notice)}</p>
  </SheetContent></Sheet>;
}
