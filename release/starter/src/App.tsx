import {useRef,useState} from 'react';
import {TenvellProvider,Button,Card,CardHeader,CardTitle,CardDescription,CardContent,Input,Checkbox,Select,Progress,Dialog,DialogTrigger,DialogContent,DialogTitle,DialogDescription,DialogClose,DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,Badge} from 'tenvell';
import type {Theme,Surface} from 'tenvell';
import {GlassBar} from 'tenvell/charts';
import {Bar,BarChart,ResponsiveContainer,Tooltip,XAxis} from 'recharts';

const trend=[{day:'Mon',value:18},{day:'Tue',value:32},{day:'Wed',value:26},{day:'Thu',value:48},{day:'Fri',value:36},{day:'Sat',value:58}];
const initialNotes=['A quiet place to start','Make the next step clear'];
const items=['Check spacing','Review links','Try every state'];
const surfaces:{value:Surface;label:string}[]=[{value:'air',label:'Air'},{value:'frost',label:'Frost'},{value:'prism',label:'Prism'},{value:'smoke',label:'Smoke'}];

export default function App(){
 const [theme,setTheme]=useState<Theme>('light'),[surface,setSurface]=useState<Surface>('air');
 const [checked,setChecked]=useState<boolean[]>([true,false,false]),[notes,setNotes]=useState(initialNotes),[search,setSearch]=useState(''),[draft,setDraft]=useState(''),[open,setOpen]=useState(false),[error,setError]=useState('');
 const field=useRef<HTMLInputElement>(null),complete=checked.filter(Boolean).length;
 const visible=notes.filter(note=>note.toLowerCase().includes(search.toLowerCase()));
 function reset(){setChecked([true,false,false]);setNotes(initialNotes);setSearch('');}
 return <div className={'starter-backdrop '+theme}>
  <TenvellProvider theme={theme} surface={surface} className="starter-shell">
   <header className="starter-header"><a href="#main" aria-label="tenvell starter home" className="starter-brand">tenvell <span>0.2</span></a><div className="starter-settings"><Select aria-label="Glass surface" value={surface} items={surfaces} onValueChange={value=>setSurface((value||'air') as Surface)}/><Button variant="ghost" size="sm" onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?'Dark theme':'Light theme'}</Button></div></header>
   <main id="main">
    <div className="starter-intro"><div><span className="starter-eyebrow">YOUR WORKSPACE</span><h1>Room for what matters.</h1><p>Thin glass, clear states and a little room to breathe.</p></div><Dialog open={open} onOpenChange={next=>{setOpen(next);if(next){setDraft('');setError('');}}}><DialogTrigger render={<Button/>}>New note</DialogTrigger><DialogContent initialFocus={field}><form onSubmit={event=>{event.preventDefault();if(!draft.trim()){setError('Give the note a title.');field.current?.focus();return;}setNotes(current=>[draft.trim(),...current]);setSearch('');setOpen(false);}}><DialogTitle>A new thought</DialogTitle><DialogDescription>Add a note to this local example.</DialogDescription><label className="starter-field">Title<Input ref={field} maxLength={100} value={draft} onChange={event=>{setDraft(event.target.value);setError('');}} aria-invalid={!!error} aria-describedby={error?'note-error':undefined}/></label>{error&&<p id="note-error" className="field-error" role="alert">{error}</p>}<div className="starter-actions"><DialogClose render={<Button variant="ghost"/>}>Cancel</DialogClose><Button type="submit">Add note</Button></div></form></DialogContent></Dialog></div>
    <section className="starter-grid">
     <Card><CardHeader><CardTitle>A small checklist</CardTitle><Badge>{complete} / 3</Badge></CardHeader><CardDescription>Every state should be easy to read.</CardDescription><CardContent><Progress value={complete} max={3} label="Checklist progress"/><div className="starter-checklist">{items.map((label,index)=><label key={label}><Checkbox checked={checked[index]} onCheckedChange={next=>setChecked(current=>current.map((value,i)=>i===index?next:value))}/><span>{label}</span></label>)}</div></CardContent></Card>
     <Card><CardHeader><CardTitle>Example trend</CardTitle><Badge tone="info">Demo data</Badge></CardHeader><CardDescription>Hover the actual shape to explore a value.</CardDescription><div className="starter-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={trend} accessibilityLayer><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'var(--muted-foreground)',fontSize:11}}/><Tooltip cursor={false} shared={false} isAnimationActive={false} content={({active,payload})=>active&&payload?.length?<div className="starter-tip"><strong>{payload[0].payload.day}</strong><span>{payload[0].value}</span></div>:null}/><Bar dataKey="value" fill="var(--chart-1)" radius={[5,5,0,0]} maxBarSize={36} shape={<GlassBar/>} activeBar={<GlassBar active/>} isAnimationActive={false}/></BarChart></ResponsiveContainer></div></Card>
     <Card className="starter-notes"><CardHeader><CardTitle>Notes</CardTitle><DropdownMenu><DropdownMenuTrigger render={<Button variant="ghost" size="sm" aria-label="Example actions"/>}>•••</DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={reset}>Reset demo</DropdownMenuItem></DropdownMenuContent></DropdownMenu></CardHeader><Input aria-label="Search notes" type="search" placeholder="Find a thought…" value={search} onChange={event=>setSearch(event.target.value)}/><ul>{visible.map((note,index)=><li key={index}>{note}</li>)}</ul>{!visible.length&&<p className="starter-muted" role="status">No notes found.</p>}<p className="starter-muted" role="status">{notes.length} notes in this local example.</p></Card>
    </section>
   </main><footer className="starter-footer">Local demo data · No backend connection</footer>
  </TenvellProvider>
 </div>;
}
