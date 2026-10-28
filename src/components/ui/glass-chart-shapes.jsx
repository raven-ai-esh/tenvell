import {useId} from "react";
import {Rectangle,Sector} from "recharts";

function GlassLight({id}) {
  return <defs><linearGradient id={id} x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="white" stopOpacity=".25"/><stop offset=".45" stopColor="white" stopOpacity=".05"/><stop offset="1" stopColor="black" stopOpacity=".09"/></linearGradient></defs>;
}

export function GlassBar({active=false,isActive=false,x,y,width,height,radius,fill,index,value}) {
  const id = 'bar-light-' + useId().replace(/:/g,'');
  const selected = active || isActive;
  if (![x,y,width,height].every(Number.isFinite) || width <= 0 || height <= 0) return null;
  const geometry = {x,y,width,height,radius};
  return <g className="glass-chart-shape" data-glass-chart="bar" data-active={selected} data-index={index} data-value={value}>
    {selected && <GlassLight id={id}/>}
    <rect data-glass-hit="" x={x} y={y} width={width} height={height} fill="transparent" pointerEvents="all"/>
    <g className={'glass-chart-visual'+(selected?' glass-chart-depth':'')}>
      <Rectangle {...geometry} fill={fill}/>
      {selected && <Rectangle {...geometry} fill={'url(#'+id+')'}/>}
      <Rectangle {...geometry} fill="none" stroke="var(--control-edge)" strokeWidth={.85}/>
    </g>
  </g>;
}

export function GlassDot({cx,cy,fill,stroke}) {
  const id = 'dot-light-' + useId().replace(/:/g,'');
  if (![cx,cy].every(Number.isFinite)) return null;
  return <g className="glass-chart-shape" data-glass-chart="point" data-active="true" aria-hidden="true">
    <GlassLight id={id}/>
    <circle data-glass-hit="" cx={cx} cy={cy} r={9} fill="transparent" pointerEvents="all"/>
    <g className="glass-chart-visual glass-chart-depth"><circle cx={cx} cy={cy} r={4.5} fill={stroke||fill||'var(--chart-1)'} stroke="var(--control-edge)" strokeWidth={.9}/><circle cx={cx} cy={cy} r={3.8} fill={'url(#'+id+')'}/></g>
  </g>;
}

export function GlassSector({active=false,isActive=false,...props}) {
  const id = 'sector-light-' + useId().replace(/:/g,'');
  const selected = active || isActive;
  return <g className="glass-chart-shape" data-glass-chart="sector" data-active={selected} data-value={props.value}>
    {selected && <GlassLight id={id}/>}
    <Sector {...props} data-glass-hit="" fill="transparent" stroke="none" pointerEvents="all" aria-hidden="true" tabIndex={undefined}/>
    <g className={'glass-chart-visual'+(selected?' glass-chart-depth':'')}>
      <Sector {...props} role="img" aria-label={(props.name||props.payload?.name||'Доля')+': '+props.value} tabIndex={undefined}/>
      {selected && <g aria-hidden="true"><Sector {...props} tabIndex={undefined} fill={'url(#'+id+')'} stroke="none"/></g>}
      <Sector {...props} tabIndex={undefined} aria-hidden="true" fill="none" stroke="var(--control-edge)" strokeWidth={.85}/>
    </g>
  </g>;
}
