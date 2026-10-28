import {useEffect,useMemo,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {TenvellPortalContext,TenvellSettingsContext} from '../components/ui/scope.jsx';
import {useGlassResponse} from '../interactions/glass-response.js';

const options={theme:['light','dark'],surface:['air','frost','prism','smoke'],accent:['slate','blue','violet','jade'],radius:['strict','soft','round'],density:['comfortable','compact']};
function choice(key,value,fallback){return options[key].includes(value)?value:fallback;}

export function TenvellProvider({children,theme='light',surface='air',accent='slate',radius='soft',density='comfortable',motion=true,className='',style,...props}) {
  const scope=useRef(null);
  const [mounted,setMounted]=useState(false),[portal,setPortal]=useState(null);
  useEffect(()=>setMounted(true),[]);
  useGlassResponse(scope,motion,portal);
  const settings={'data-tenvell':'','data-motion':motion?'full':'reduced','data-theme':choice('theme',theme,'light'),'data-surface':choice('surface',surface,'air'),'data-accent':choice('accent',accent,'slate'),'data-radius':choice('radius',radius,'soft'),'data-density':choice('density',density,'comfortable')};
  const config=useMemo(()=>({surface:settings['data-surface']}),[settings['data-surface']]);
  const portalStyle=style?Object.fromEntries(Object.entries(style).filter(([name])=>name.startsWith('--'))):undefined;
  return <TenvellSettingsContext.Provider value={config}><TenvellPortalContext.Provider value={portal}>
    <div {...props} {...settings} ref={scope} style={style} className={'tenvell '+className}>{children}</div>
    {mounted&&createPortal(<div {...settings} ref={setPortal} style={portalStyle} className="tenvell tenvell-portal"/>,document.body)}
  </TenvellPortalContext.Provider></TenvellSettingsContext.Provider>;
}
