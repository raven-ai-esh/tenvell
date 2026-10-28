import {useState} from "react";
import {ChevronDown,Image as ImageIcon,Layers2,Moon,Sun} from "lucide-react";
import {Button,DropdownMenu,DropdownMenuContent,DropdownMenuLabel,DropdownMenuRadioGroup,DropdownMenuRadioItem,DropdownMenuTrigger} from "../components/ui";
import {glassMaterials} from "../components/ui/glass.jsx";
import {setPreviewSetting,usePreviewSettings} from "./preferences.js";
import "./preview.css";
import {StylePanel} from "./StylePanel.jsx";
import {useGlassResponse} from "../interactions/glass-response.js";

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
    <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="sm" className="preview-trigger" aria-label={label+": "+selected.name} title={label+": "+selected.name}/>}><Icon size={16} strokeWidth={1.5} aria-hidden="true"/><span className="preview-control-label">{label}</span><ChevronDown className="preview-chevron" size={12} aria-hidden="true"/></DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="preview-menu">
      <DropdownMenuRadioGroup value={value} onValueChange={next=>{setPreviewSetting(kind,next);setOpen(false);}}><DropdownMenuLabel>{kind==="surface"?"Тип поверхности":"Задний фон"}</DropdownMenuLabel>{items.map(item=><DropdownMenuRadioItem key={item.id} value={item.id} closeOnClick><span className="preview-option">{kind==="surface"?<span className="preview-surface-swatch glass-surface" data-glass={item.id} aria-hidden="true"/>:<span className="preview-background-swatch" data-backdrop={item.id} aria-hidden="true"/>}<span className="preview-option-copy"><strong>{item.name}</strong><small>{item.description}</small></span></span></DropdownMenuRadioItem>)}</DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}

export function PreviewControls(){
  useGlassResponse();
  const {theme,surface,backdrop}=usePreviewSettings();
  return <div className="preview-controls" role="group" aria-label="Настройки предпросмотра">
    <PreviewMenu kind="backdrop" label="Фон" icon={ImageIcon} items={backdrops} value={backdrop}/>
    <StylePanel/>
    <PreviewMenu kind="surface" label="Стекло" icon={Layers2} items={glassMaterials} value={surface}/>
    <Button type="button" variant="icon" size="icon" className="preview-theme" aria-label={theme==="light"?"Включить тёмную тему":"Включить светлую тему"} title={theme==="light"?"Тёмная тема":"Светлая тема"} onClick={()=>setPreviewSetting("theme",theme==="light"?"dark":"light")}>{theme==="light"?<Sun size={18} strokeWidth={1.5} aria-hidden="true"/>:<Moon size={18} strokeWidth={1.5} aria-hidden="true"/>}</Button>
  </div>;
}
