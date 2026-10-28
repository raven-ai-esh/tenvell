import {t} from "../i18n/translate.js";
import {useLanguage} from '../i18n/language.js';
import {localizedNumberFormat,localizedDateFormat,localizedPluralRules} from "../i18n/format.js";
import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { Example } from "./Example.jsx";
import {GlassBar,GlassDot,GlassSector} from "../components/ui/glass-chart-shapes.jsx";
import {ChartExtras} from "./ChartExtras.jsx";

const number = localizedNumberFormat();
const shortDate = localizedDateFormat({ day: "numeric", month: "short", timeZone: "UTC" });
const fullDate = localizedDateFormat({ day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const anchor = Date.UTC(2026, 9, 27, 12);
const allData = Array.from({ length: 90 }, (_, index) => {
  const time = anchor - (89 - index) * 86400000;
  const visitors = Math.round(120 + index * 3.1 + ((index * 13) % 21) * 5 + Math.sin(index * .85) * 36);
  const desktop = Math.round(visitors * (.58 + (index % 5) * .025));
  return { time, visitors, desktop, mobile: visitors - desktop };
});

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip" role="tooltip">{(label||payload[0].payload.date) && <p>{t(label||payload[0].payload.date)}</p>}{payload.map((item) => <div key={item.dataKey || item.name}><span className="legend-dot" style={{ backgroundColor: item.color || item.payload.fill }} /><span>{t(item.name)}</span><strong>{t(number.format(item.value))}</strong></div>)}</div>;
}

function DataTable({ data }) {
  return <details className="chart-data"><summary>{t("Таблица данных")}</summary><div className="chart-table-scroll" tabIndex={0}><table><caption className="sr-only">{t("Значение по дням")}</caption><thead><tr><th>{t("Дата")}</th><th>{t("Всего")}</th><th>{t("Ряд A")}</th><th>{t("Ряд B")}</th></tr></thead><tbody>{data.map((item) => <tr key={item.fullDate}><td>{t(item.date)}</td><td>{t(number.format(item.visitors))}</td><td>{t(number.format(item.desktop))}</td><td>{t(number.format(item.mobile))}</td></tr>)}</tbody></table></div></details>;
}

export default function ChartsPage() {
  const language=useLanguage();
  const [period, setPeriod] = useState(7);
  const [barInput,setBarInput] = useState("pointer");
  const [series, setSeries] = useState({ desktop: true, mobile: true });
  const data = useMemo(() => allData.slice(-period).map(row=>({...row,date:shortDate.format(row.time),fullDate:fullDate.format(row.time)})), [period,language]);
  const total = data.reduce((sum, item) => sum + item.visitors, 0);
  const desktop = data.reduce((sum, item) => sum + item.desktop, 0);
  const pieData = [
    { name: "Сегмент A", value: desktop, fill: "var(--chart-1)" },
    { name: "Сегмент B", value: Math.round((total - desktop) * .76), fill: "var(--chart-2)" },
    { name: "Сегмент C", value: total - desktop - Math.round((total - desktop) * .76), fill: "var(--chart-3)" },
  ];
  const axis = { axisLine: false, tickLine: false, tick: { fill: "var(--muted-foreground)", fontSize: 11 } };
  return <>
    <div className="chart-page-tools"><span>{t("Демонстрационные данные")}</span><div className="segmented" role="group" aria-label={t("Период графиков")}>{[7,30,90].map((days) => <button key={days} aria-pressed={period === days} onClick={() => setPeriod(days)}>{t(days)}{t(" дней")}</button>)}</div></div>
    <Example id="area" title={t("Динамика")} description={t("Плавная линия и прозрачная заливка оставляют данные на первом плане.")} code={'import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";\nimport { GlassDot } from "@/components/ui/glass-chart-shapes";\n\n<ResponsiveContainer width="100%" height={260}>\n  <AreaChart data={data} accessibilityLayer>\n    <XAxis dataKey="date" axisLine={false} tickLine={false} />\n    <Tooltip isAnimationActive={false} cursor={false} />\n    <Area activeDot={<GlassDot />} dataKey="visitors" type="monotone"\n      stroke="var(--chart-ink-1)" fill="var(--chart-1)"\n      fillOpacity={0.12} strokeWidth={2} />\n  </AreaChart>\n</ResponsiveContainer>'}>
      <div className="chart-example"><div className="chart-heading"><div><span className="chart-overline">{t("Значение за ")}{t(period)}{t(" дней")}</span><strong className="chart-total" data-chart-total>{t(number.format(total))}</strong></div><span className="chart-trend"><TrendingUp size={15} aria-hidden="true" />{t("Активность")}</span></div><p className="chart-range">{t(data[0].fullDate)} — {t(data[data.length - 1].fullDate)}</p>
        <figure className="chart-plot" aria-label={t("Динамика значений")}><ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={data} margin={{ top: 16, right: 6, left: 0, bottom: 0 }} accessibilityLayer title={t("Динамика значений")}><CartesianGrid vertical={false} stroke="var(--separator)" strokeDasharray="3 5" /><XAxis tickFormatter={t} dataKey="date" {...axis} minTickGap={32} tickMargin={12} /><YAxis tickFormatter={t} {...axis} width={46} tickCount={4} /><Tooltip isAnimationActive={false} content={<ChartTooltip />} cursor={false} /><Area dataKey="visitors" name={t("Значение")} type="monotone" stroke="var(--chart-ink-1)" strokeWidth={2} fill="var(--chart-1)" fillOpacity={.12} isAnimationActive={false} activeDot={<GlassDot />} /></AreaChart></ResponsiveContainer></figure>
        <DataTable data={data} />
      </div>
    </Example>
    <Example id="bars" title={t("Сравнение")} description={t("Нажмите на легенду, чтобы показать или скрыть ряд.")} code={'import { useState } from "react";\nimport { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";\nimport { GlassBar } from "@/components/ui/glass-chart-shapes";\n\nconst [inputMode,setInputMode] = useState("pointer");\n\n<div onPointerMoveCapture={()=>setInputMode("pointer")}\n  onKeyDownCapture={()=>setInputMode("keyboard")}>\n<ResponsiveContainer width="100%" height={260}>\n  <BarChart data={data} accessibilityLayer>\n    <XAxis dataKey="date" />\n    {/* Указатель: один столбец. Клавиатура: оба ряда дня. */}\n    <Tooltip isAnimationActive={false} cursor={false} shared={inputMode === "keyboard"} />\n    <Bar shape={<GlassBar/>} activeBar={<GlassBar active/>} dataKey="desktop" fill="var(--chart-1)" radius={[4,4,0,0]} />\n    <Bar shape={<GlassBar/>} activeBar={<GlassBar active/>} dataKey="mobile" fill="var(--chart-2)" radius={[4,4,0,0]} />\n  </BarChart>\n</ResponsiveContainer>\n</div>'}>
      <div className="chart-example"><div className="chart-heading"><div><h3>{t("Сравнение рядов")}</h3><p className="chart-range">{t("Два ряда на общей шкале")}</p></div></div><div className="chart-legend" role="group" aria-label={t("Ряды графика")}>{[["desktop","Ряд A","--chart-1"],["mobile","Ряд B","--chart-2"]].map(([key,label,color]) => <button key={key} aria-pressed={series[key]} onClick={() => setSeries({ ...series, [key]: !series[key] })}><span className="legend-dot" style={{ backgroundColor: "var(" + color + ")" }} />{t(label)}</button>)}</div>
        {series.desktop || series.mobile ? <figure className="chart-plot" aria-label={t("Сравнение рядов")} onPointerMoveCapture={()=>setBarInput("pointer")} onKeyDownCapture={event=>{if (["ArrowLeft","ArrowRight","Enter"].includes(event.key)) setBarInput("keyboard");}}><ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={data} margin={{ top: 18, right: 6, left: 0, bottom: 0 }} accessibilityLayer title={t("Сравнение рядов")}><CartesianGrid vertical={false} stroke="var(--separator)" strokeDasharray="3 5" /><XAxis tickFormatter={t} dataKey="date" {...axis} minTickGap={32} tickMargin={12} /><YAxis tickFormatter={t} {...axis} width={46} tickCount={4} /><Tooltip isAnimationActive={false} content={<ChartTooltip />} cursor={false} shared={barInput==="keyboard"} />{series.desktop && <Bar shape={<GlassBar/>} activeBar={<GlassBar active/>} dataKey="desktop" name={t("Ряд A")} fill="var(--chart-1)" radius={[4,4,0,0]} maxBarSize={26} isAnimationActive={false} />}{series.mobile && <Bar shape={<GlassBar/>} activeBar={<GlassBar active/>} dataKey="mobile" name={t("Ряд B")} fill="var(--chart-2)" radius={[4,4,0,0]} maxBarSize={26} isAnimationActive={false} />}</BarChart></ResponsiveContainer></figure> : <div className="chart-empty" role="status">{t("Выберите хотя бы один ряд данных.")}</div>}
      </div>
    </Example>
    <Example id="donut" title={t("Распределение")} description={t("Три спокойных цвета и подписи рядом с данными.")} code={'import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";\nimport { GlassSector } from "@/components/ui/glass-chart-shapes";\n\n<ResponsiveContainer width="100%" height={240}>\n  <PieChart>\n    <Pie shape={<GlassSector/>} data={data} dataKey="value" nameKey="name"\n      innerRadius={68} outerRadius={90} paddingAngle={4}>\n      {data.map(item => <Cell key={item.name} fill={item.fill} />)}\n    </Pie>\n    <Tooltip isAnimationActive={false} position={{x:8,y:8}} cursor={false} />\n  </PieChart>\n</ResponsiveContainer>'}>
      <div className="chart-example donut-example"><div className="donut-plot"><ResponsiveContainer width="100%" height={240} minWidth={0}><PieChart accessibilityLayer title={t("Распределение значений")}><Tooltip isAnimationActive={false} position={{x:8,y:8}} cursor={false} content={<ChartTooltip />} /><Pie shape={<GlassSector/>} data={pieData} dataKey="value" nameKey="name" innerRadius={73} outerRadius={94} paddingAngle={4} cornerRadius={4} stroke="none" isAnimationActive={false}>{pieData.map((item) => <Cell key={item.name} fill={item.fill} />)}</Pie></PieChart></ResponsiveContainer><div className="donut-total"><strong>{t(number.format(total))}</strong><span>{t("значений")}</span></div></div><div className="donut-legend">{pieData.map((item) => <div key={item.name}><span className="legend-dot" style={{ backgroundColor: item.fill }} /><span>{t(item.name)}</span><strong>{t(Math.round(item.value / total * 100))}%</strong></div>)}<p>{t("Распределение за ")}{t(period)}{t(" дней.")}</p></div></div>
    </Example>
    <ChartExtras data={data}/>
  </>;
}
