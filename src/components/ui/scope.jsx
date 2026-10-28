import {createContext,useContext} from 'react';

// undefined preserves the catalog's existing body portals; null defers a new kit scope.
export const TenvellPortalContext=createContext(undefined);
export const TenvellSettingsContext=createContext(null);

export function ScopedPortal({component:Portal,children,...props}) {
  const container=useContext(TenvellPortalContext);
  if(container===null)return null;
  return <Portal container={container} className={container?'tenvell-layer':undefined} style={container?{display:'block',position:'relative'}:undefined} {...props}>{children}</Portal>;
}
