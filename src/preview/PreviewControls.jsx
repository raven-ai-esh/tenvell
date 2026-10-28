import {t} from "../i18n/translate.js";
import {useState} from "react";
import {ChevronDown,Image as ImageIcon,Layers2,Moon,Sun} from "lucide-react";
import {Button,DropdownMenu,DropdownMenuContent,DropdownMenuLabel,DropdownMenuRadioGroup,DropdownMenuRadioItem,DropdownMenuTrigger} from "../components/ui";
import {glassMaterials} from "../components/ui/glass.jsx";
import {setPreviewSetting,usePreviewSettings} from "./preferences.js";
import "./preview.css";
import {StylePanel} from "./StylePanel.jsx";
import {useGlassResponse} from "../interactions/glass-response.js";
import {LanguageSwitcher} from '../i18n/LanguageSwitcher.jsx';

export const backdrops=[
  {id:"light",name:"Свет",description:"Рассеянный свет и спокойный градиент."},
  {id:"plain",name:"Однотонный",description:"Ровная поверхность без деталей."},
  {id:"color",name:"Цвет",description:"Холодные и тёплые оттенки."},
  {id:"graphic",name:"Графика",description:"Полосы и сетка для проверки стекла."},
];

function PreviewMenu({kind,label,icon:Icon,items,value}){
  const [open,setOpen]=useState(false);
  const selected=items.find(item=>item.id===value);
  return <DropdownMenu open={open} onOpenChange={setOpen}>
    <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="sm" className="preview-trigger" aria-label={t(label+": "+selected.name)} title={t(label+": "+selected.name)}/>}><Icon size={16} strokeWidth={1.5} aria-hidden="true"/><span className="preview-control-label">{t(label)}</span><ChevronDown className="preview-chevron" size={12} aria-hidden="true"/></DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="preview-menu">
      <DropdownMenuRadioGroup value={value} onValueChange={next=>{setPreviewSetting(kind,next);setOpen(false);}}><DropdownMenuLabel>{t(kind==="surface"?"Тип поверхности":"Задний фон")}</DropdownMenuLabel>{items.map(item=><DropdownMenuRadioItem key={item.id} value={item.id} closeOnClick><span className="preview-option">{kind==="surface"?<span className="preview-surface-swatch glass-surface" data-glass={item.id} aria-hidden="true"/>:<span className="preview-background-swatch" data-backdrop={item.id} aria-hidden="true"/>}<span className="preview-option-copy"><strong>{t(item.name)}</strong><small>{t(item.description)}</small></span></span></DropdownMenuRadioItem>)}</DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}

export function PreviewControls(){
  useGlassResponse();
  const {theme,surface,backdrop}=usePreviewSettings();
  return <div className="preview-controls" role="group" aria-label={t("Настройки предпросмотра")}>
    <LanguageSwitcher/>
    <PreviewMenu kind="backdrop" label={t("Фон")} icon={ImageIcon} items={backdrops} value={backdrop}/>
    <StylePanel/>
    <PreviewMenu kind="surface" label={t("Стекло")} icon={Layers2} items={glassMaterials} value={surface}/>
    <Button type="button" variant="icon" size="icon" className="preview-theme" aria-label={t(theme==="light"?"Включить тёмную тему":"Включить светлую тему")} title={t(theme==="light"?"Тёмная тема":"Светлая тема")} onClick={()=>setPreviewSetting("theme",theme==="light"?"dark":"light")}>{theme==="light"?<Sun size={18} strokeWidth={1.5} aria-hidden="true"/>:<Moon size={18} strokeWidth={1.5} aria-hidden="true"/>}</Button>
  </div>;
}
