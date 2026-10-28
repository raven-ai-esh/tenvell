import {useUiText} from './scope.jsx';
import {useEffect,useId,useState} from "react";
import {Accordion as A} from "@base-ui/react/accordion";
import {Tabs as T} from "@base-ui/react/tabs";
import {Popover as P} from "@base-ui/react/popover";
import {Tooltip as H} from "@base-ui/react/tooltip";
import {Combobox as C} from "@base-ui/react/combobox";
import {Dialog as D} from "@base-ui/react/dialog";
import {Check,ChevronDown,ChevronsUpDown,X} from "lucide-react";
import {Button} from "./controls.jsx";
import "./primitives.css";
import {ScopedPortal} from "./scope.jsx";

export function Tabs({className="",...props}){return <T.Root className={"ui-tabs-root "+className} {...props}/>;}
export function TabsList({className="",activateOnFocus=true,variant="segmented",...props}){return <T.List className={"ui-tabs-list "+className} data-variant={variant} activateOnFocus={activateOnFocus} {...props}/>;}
export function TabsTrigger({className="",...props}){return <T.Tab className={"ui-tabs-trigger "+className} {...props}/>;}
export function TabsContent({className="",...props}){return <T.Panel className={"ui-tabs-content "+className} {...props}/>;}
export function Accordion({className="",...props}){return <A.Root className={"ui-accordion "+className} {...props}/>;}
export const AccordionItem=A.Item;
export function AccordionTrigger({children,className="",...props}){return <A.Header className="ui-accordion-header"><A.Trigger className={"ui-accordion-trigger "+className} {...props}>{children}<ChevronDown size={16} aria-hidden="true"/></A.Trigger></A.Header>;}
export function AccordionContent({children,className="",...props}){return <A.Panel className={"ui-accordion-panel "+className} {...props}><div>{children}</div></A.Panel>;}
export const Popover=P.Root;
export const PopoverTrigger=P.Trigger;
export const PopoverClose=P.Close;
export const PopoverTitle=P.Title;
export const PopoverDescription=P.Description;
export function PopoverContent({className="",align="center",...props}){return <ScopedPortal component={P.Portal}><P.Positioner sideOffset={8} align={align} className="ui-float-positioner"><P.Popup className={"ui-popover "+className} {...props}/></P.Positioner></ScopedPortal>;}
export function Tooltip({children,content,side="top"}){const id=useId(),[open,setOpen]=useState(false);const described=[children.props["aria-describedby"],open?id:null].filter(Boolean).join(" ")||undefined;return <H.Provider delay={300}><H.Root open={open} onOpenChange={setOpen}><H.Trigger render={children} aria-describedby={described}/><ScopedPortal component={H.Portal}><H.Positioner side={side} sideOffset={8} className="ui-float-positioner"><H.Popup id={id} role="tooltip" className="ui-tooltip">{content}</H.Popup></H.Positioner></ScopedPortal></H.Root></H.Provider>;}
export const Sheet=D.Root;
export const SheetTrigger=D.Trigger;
export const SheetClose=D.Close;
export const SheetTitle=D.Title;
export const SheetDescription=D.Description;
export function SheetContent({children,className="",...props}){const t=useUiText();return <ScopedPortal component={D.Portal}><D.Backdrop className="ui-sheet-backdrop"/><D.Popup className={"ui-sheet-panel "+className} {...props}><D.Close render={<Button variant="icon" size="icon" className="ui-sheet-close" aria-label={t("Закрыть панель")}/>}><X size={19} aria-hidden="true"/></D.Close>{children}</D.Popup></ScopedPortal>;}
export function Combobox({items,value,onValueChange,label,placeholder,disabled=false}){
  const t=useUiText();
  const [localValue,setLocalValue]=useState(null);
  const selected=value===undefined?localValue:value;
  const [query,setQuery]=useState(null);
  // Keep an unfinished query separate from the localized selected-item label.
  useEffect(()=>setQuery(null),[selected]);
  function changeInput(next,details){
    if(details.reason==='input-change')setQuery(next);
    else if(details.reason==='item-press'||details.reason==='clear-press')setQuery(null);
    else if(details.reason!=='none')setQuery(next===(selected==null?'':t(selected))?null:next);
  }
  function choose(next,details){if(value===undefined)setLocalValue(next);setQuery(null);onValueChange?.(next,details);}
  return <C.Root items={items} itemToStringLabel={t}
    inputValue={query??(selected==null?'':t(selected))} onInputValueChange={changeInput}
    filter={(item,search)=>t(item).toLocaleLowerCase().includes(search.toLocaleLowerCase())||item.toLocaleLowerCase().includes(search.toLocaleLowerCase())}
    value={selected} onValueChange={choose} disabled={disabled}>
    <C.InputGroup data-glass-response="field" className="ui-combobox-control">
      <C.Input className="ui-combobox-input" aria-label={label??t("Выбор")} placeholder={placeholder??t("Найти…")}/>
      <C.Trigger className="ui-combobox-trigger" aria-label={t("Открыть:")+" "+(label??t("Выбор"))}><ChevronsUpDown size={16} aria-hidden="true"/></C.Trigger>
    </C.InputGroup>
    <ScopedPortal component={C.Portal}><C.Positioner sideOffset={7} className="ui-float-positioner"><C.Popup className="ui-combobox-popup">
      <C.Empty className="ui-combobox-empty">{t("Ничего не найдено")}</C.Empty>
      <C.List>{item=><C.Item key={item} value={item} className="ui-combobox-item"><span>{t(item)}</span><C.ItemIndicator><Check size={14} aria-hidden="true"/></C.ItemIndicator></C.Item>}</C.List>
    </C.Popup></C.Positioner></ScopedPortal>
  </C.Root>;
}
