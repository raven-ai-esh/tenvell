import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { Example } from "./Example.jsx";
import {GlassBar,GlassDot,GlassSector} from "../components/ui/glass-chart-shapes.jsx";
import {ChartExtras} from "./ChartExtras.jsx";

const number = new Intl.NumberFormat("ru-RU");
const shortDate = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const anchor = Date.UTC(2026, 9, 27, 12);
const allData = Array.from({ length: 90 }, (_, index) => {
  const time = anchor - (89 - index) * 86400000;
  const visitors = Math.round(120 + index * 3.1 + ((index * 13) % 21) * 5 + Math.sin(index * .85) * 36);
  const desktop = Math.round(visitors * (.58 + (index % 5) * .025));
  return { date: shortDate.format(time), fullDate: fullDate.format(time), visitors, desktop, mobile: visitors - desktop };
});

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip" role="tooltip">{(label||payload[0].payload.date) && <p>{label||payload[0].payload.date}</p>}{payload.map((item) => <div key={item.dataKey || item.name}><span className="legend-dot" style={{ backgroundColor: item.color || item.payload.fill }} /><span>{item.name}</span><strong>{number.format(item.value)}</strong></div>)}</div>;
}

function DataTable({ data }) {
  return <details className="chart-data"><summary>Таблица данных</summary><div className="chart-table-scroll" tabIndex={0}><table><caption className="sr-only">Значение по дням</caption><thead><tr><th>Дата</th><th>Всего</th><th>Ряд A</th><th>Ряд B</th></tr></thead><tbody>{data.map((item) => <tr key={item.fullDate}><td>{item.date}</td><td>{number.format(item.visitors)}</td><td>{number.format(item.desktop)}</td><td>{number.format(item.mobile)}</td></tr>)}</tbody></table></div></details>;
}

export default function ChartsPage() {
  const [period, setPeriod] = useState(7);
  const [barInput,setBarInput] = useState("pointer");
  const [series, setSeries] = useState({ desktop: true, mobile: true });
  const data = useMemo(() => allData.slice(-period), [period]);
  const total = data.reduce((sum, item) => sum + item.visitors, 0);
  const desktop = data.reduce((sum, item) => sum + item.desktop, 0);
  const pieData = [
    { name: "Сегмент A", value: desktop, fill: "var(--chart-1)" },
    { name: "Сегмент B", value: Math.round((total - desktop) * .76), fill: "var(--chart-2)" },
    { name: "Сегмент C", value: total - desktop - Math.round((total - desktop) * .76), fill: "var(--chart-3)" },
  ];
  const axis = { axisLine: false, tickLine: false, tick: { fill: "var(--muted-foreground)", fontSize: 11 } };
  return <>
    <div className="chart-page-tools"><span>Демонстрационные данные</span><div className="segmented" role="group" aria-label="Период графиков">{[7,30,90].map((days) => <button key={days} aria-pressed={period === days} onClick={() => setPeriod(days)}>{days} дней</button>)}</div></div>
    <Example id="area" title="Динамика" description="Плавная линия и прозрачная заливка оставляют данные на первом плане." code={'import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";\nimport { GlassDot } from "@/components/ui/glass-chart-shapes";\n\n<ResponsiveContainer width="100%" height={260}>\n  <AreaChart data={data} accessibilityLayer>\n    <XAxis dataKey="date" axisLine={false} tickLine={false} />\n    <Tooltip isAnimationActive={false} cursor={false} />\n    <Area activeDot={<GlassDot />} dataKey="visitors" type="monotone"\n      stroke="var(--chart-ink-1)" fill="var(--chart-1)"\n      fillOpacity={0.12} strokeWidth={2} />\n  </AreaChart>\n</ResponsiveContainer>'}>
      <div className="chart-example"><div className="chart-heading"><div><span className="chart-overline">Значение за {period} дней</span><strong className="chart-total" data-chart-total>{number.format(total)}</strong></div><span className="chart-trend"><TrendingUp size={15} aria-hidden="true" />Активность</span></div><p className="chart-range">{data[0].fullDate} — {data[data.length - 1].fullDate}</p>
        <figure className="chart-plot" aria-label="Динамика значений"><ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={data} margin={{ top: 16, right: 6, left: 0, bottom: 0 }} accessibilityLayer title="Динамика значений"><CartesianGrid vertical={false} stroke="var(--separator)" strokeDasharray="3 5" /><XAxis dataKey="date" {...axis} minTickGap={32} tickMargin={12} /><YAxis {...axis} width={46} tickCount={4} /><Tooltip isAnimationActive={false} content={<ChartTooltip />} cursor={false} /><Area dataKey="visitors" name="Значение" type="monotone" stroke="var(--chart-ink-1)" strokeWidth={2} fill="var(--chart-1)" fillOpacity={.12} isAnimationActive={false} activeDot={<GlassDot />} /></AreaChart></ResponsiveContainer></figure>
        <DataTable data={data} />
      </div>
    </Example>
    <Example id="bars" title="Сравнение" description="Нажмите на легенду, чтобы показать или скрыть ряд." code={'import { useState } from "react";\nimport { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";\nimport { GlassBar } from "@/components/ui/glass-chart-shapes";\n\nconst [inputMode,setInputMode] = useState("pointer");\n\n<div onPointerMoveCapture={()=>setInputMode("pointer")}\n  onKeyDownCapture={()=>setInputMode("keyboard")}>\n<ResponsiveContainer width="100%" height={260}>\n  <BarChart data={data} accessibilityLayer>\n    <XAxis dataKey="date" />\n    {/* Указатель: один столбец. Клавиатура: оба ряда дня. */}\n    <Tooltip isAnimationActive={false} cursor={false} shared={inputMode === "keyboard"} />\n    <Bar shape={<GlassBar/>} activeBar={<GlassBar active/>} dataKey="desktop" fill="var(--chart-1)" radius={[4,4,0,0]} />\n    <Bar shape={<GlassBar/>} activeBar={<GlassBar active/>} dataKey="mobile" fill="var(--chart-2)" radius={[4,4,0,0]} />\n  </BarChart>\n</ResponsiveContainer>\n</div>'}>
      <div className="chart-example"><div className="chart-heading"><div><h3>Сравнение рядов</h3><p className="chart-range">Два ряда на общей шкале</p></div></div><div className="chart-legend" role="group" aria-label="Ряды графика">{[["desktop","Ряд A","--chart-1"],["mobile","Ряд B","--chart-2"]].map(([key,label,color]) => <button key={key} aria-pressed={series[key]} onClick={() => setSeries({ ...series, [key]: !series[key] })}><span className="legend-dot" style={{ backgroundColor: "var(" + color + ")" }} />{label}</button>)}</div>
        {series.desktop || series.mobile ? <figure className="chart-plot" aria-label="Сравнение рядов" onPointerMoveCapture={()=>setBarInput("pointer")} onKeyDownCapture={event=>{if (["ArrowLeft","ArrowRight","Enter"].includes(event.key)) setBarInput("keyboard");}}><ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={data} margin={{ top: 18, right: 6, left: 0, bottom: 0 }} accessibilityLayer title="Сравнение рядов"><CartesianGrid vertical={false} stroke="var(--separator)" strokeDasharray="3 5" /><XAxis dataKey="date" {...axis} minTickGap={32} tickMargin={12} /><YAxis {...axis} width={46} tickCount={4} /><Tooltip isAnimationActive={false} content={<ChartTooltip />} cursor={false} shared={barInput==="keyboard"} />{series.desktop && <Bar shape={<GlassBar/>} activeBar={<GlassBar active/>} dataKey="desktop" name="Ряд A" fill="var(--chart-1)" radius={[4,4,0,0]} maxBarSize={26} isAnimationActive={false} />}{series.mobile && <Bar shape={<GlassBar/>} activeBar={<GlassBar active/>} dataKey="mobile" name="Ряд B" fill="var(--chart-2)" radius={[4,4,0,0]} maxBarSize={26} isAnimationActive={false} />}</BarChart></ResponsiveContainer></figure> : <div className="chart-empty" role="status">Выберите хотя бы один ряд данных.</div>}
      </div>
    </Example>
    <Example id="donut" title="Распределение" description="Три спокойных цвета и подписи рядом с данными." code={'import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";\nimport { GlassSector } from "@/components/ui/glass-chart-shapes";\n\n<ResponsiveContainer width="100%" height={240}>\n  <PieChart>\n    <Pie shape={<GlassSector/>} data={data} dataKey="value" nameKey="name"\n      innerRadius={68} outerRadius={90} paddingAngle={4}>\n      {data.map(item => <Cell key={item.name} fill={item.fill} />)}\n    </Pie>\n    <Tooltip isAnimationActive={false} position={{x:8,y:8}} cursor={false} />\n  </PieChart>\n</ResponsiveContainer>'}>
      <div className="chart-example donut-example"><div className="donut-plot"><ResponsiveContainer width="100%" height={240} minWidth={0}><PieChart accessibilityLayer title="Распределение значений"><Tooltip isAnimationActive={false} position={{x:8,y:8}} cursor={false} content={<ChartTooltip />} /><Pie shape={<GlassSector/>} data={pieData} dataKey="value" nameKey="name" innerRadius={73} outerRadius={94} paddingAngle={4} cornerRadius={4} stroke="none" isAnimationActive={false}>{pieData.map((item) => <Cell key={item.name} fill={item.fill} />)}</Pie></PieChart></ResponsiveContainer><div className="donut-total"><strong>{number.format(total)}</strong><span>значений</span></div></div><div className="donut-legend">{pieData.map((item) => <div key={item.name}><span className="legend-dot" style={{ backgroundColor: item.fill }} /><span>{item.name}</span><strong>{Math.round(item.value / total * 100)}%</strong></div>)}<p>Распределение за {period} дней.</p></div></div>
    </Example>
    <ChartExtras data={data}/>
  </>;
}
