import {useState} from "react";
import {DayPicker} from "react-day-picker";
import {ru} from "react-day-picker/locale";
import {CalendarDays} from "lucide-react";
import {Button} from "./controls.jsx";
import {Popover,PopoverContent,PopoverTrigger} from "./advanced.jsx";
import "react-day-picker/style.css";
import "./primitives.css";

export const demoToday=new Date(2026,9,28,12);
export function formatDate(date){return date?new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric"}).format(date):"Выбрать дату";}
export function Calendar({className="",...props}){return <DayPicker locale={ru} today={demoToday} defaultMonth={demoToday} showOutsideDays className={"ui-calendar "+className} {...props}/>;}
export function DatePicker({value,onValueChange,label="Дата",disabled=false}){const[open,setOpen]=useState(false);return <Popover open={open} onOpenChange={setOpen}><PopoverTrigger render={<Button variant="outline" className="ui-date-trigger" disabled={disabled} aria-label={label+": "+formatDate(value)}/>}><CalendarDays size={16} aria-hidden="true"/><span>{formatDate(value)}</span></PopoverTrigger><PopoverContent className="ui-calendar-popover" align="start" aria-label={label}><Calendar mode="single" defaultMonth={value||demoToday} selected={value} onSelect={date=>{onValueChange(date);setOpen(false);}} autoFocus/><Button variant="ghost" size="sm" onClick={()=>{onValueChange(undefined);setOpen(false);}}>Сбросить дату</Button></PopoverContent></Popover>;}
