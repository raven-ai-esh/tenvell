"use client";

import {useState} from 'react';
import {TenvellProvider,Button} from '../kit/index.jsx';
import '../kit/kit.css';

// The same source is shown on /install and published as @tenvell/button-demo.
export default function ButtonDemo({language='en'}:{language?:'en'|'ru'}={}) {
  const [count,setCount]=useState(0);
  const [dark,setDark]=useState(false);
  const ru=language==='ru';
  return <TenvellProvider theme={dark?'dark':'light'} surface="air" style={{borderRadius:18,padding:'clamp(18px,4vw,28px)',background:dark?'linear-gradient(130deg,#16242e,#272432)':'linear-gradient(130deg,#e8f4fa,#faf1eb)',minHeight:176}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap',marginBottom:24}}>
      <span style={{fontSize:13,color:'var(--muted-foreground)'}}>tenvell · Button</span>
      <Button size="sm" variant="ghost" aria-pressed={dark} onClick={()=>setDark(value=>!value)}>{ru?(dark?'Светлая тема':'Тёмная тема'):(dark?'Light theme':'Dark theme')}</Button>
    </div>
    <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
      <Button onClick={()=>setCount(value=>value+1)}>{ru?'Попробовать кнопку':'Try the button'}</Button>
      <Button variant="outline" disabled={!count} onClick={()=>setCount(0)}>{ru?'Сбросить':'Reset'}</Button>
      <span role="status" style={{fontSize:13,color:'var(--foreground)'}}>{ru?'Нажатий: ':'Clicks: '}{count}</span>
    </div>
  </TenvellProvider>;
}
