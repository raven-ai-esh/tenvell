export const glassMaterials = [
  {id:"air",name:"Воздух",description:"Почти прозрачный слой. Фон остаётся частью поверхности."},
  {id:"frost",name:"Иней",description:"Матовое стекло. Мягкое рассеивание и спокойная плотность."},
  {id:"prism",name:"Призма",description:"Тонкий перелив холодного и тёплого света."},
  {id:"smoke",name:"Дымка",description:"Приглушённый оттенок и чуть больше глубины."},
];

export function GlassSurface({as:Element="div",surface,className="",...props}) {
  const settings=useContext(TenvellSettingsContext);
  return <Element className={"glass-surface "+className} data-glass={surface??settings?.surface??'air'} {...props}/>;
}

export function GlassPicker({value,onChange,label="Стекло"}) {
  return <div className="glass-picker" role="group" aria-label={label}>
    <span className="glass-picker-label">{label}</span>
    <div className="glass-picker-options">{glassMaterials.map(material=><button key={material.id} type="button" aria-pressed={value===material.id} onClick={()=>onChange(material.id)}><span className="glass-swatch glass-surface" data-glass={material.id} aria-hidden="true"/>{material.name}</button>)}</div>
  </div>;
}
import {useContext} from 'react';
import {TenvellSettingsContext} from './scope.jsx';

