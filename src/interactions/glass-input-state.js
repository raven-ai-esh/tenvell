export const idleGlassInput = () => ({hover:[], pressed:null, pointer:null, key:null});

// Targets are stable object identities, ordered from child to parent.
// Input handling never activates an action; the browser/component owns clicks.
export function reduceGlassInput(state, event) {
  const hits = event.hits || [];
  const hover = event.canHover === false ? [] : hits;
  switch (event.type) {
    case 'down':
      return {hover, pressed:event.target || null, pointer:{id:event.id,target:event.target || null,path:hits}, key:null};
    case 'up':
      if (state.pointer && state.pointer.id !== event.id) return state;
      return {hover, pressed:null, pointer:null, key:null};
    case 'keydown':
      if (!event.target || state.key) return state;
      return {...state, pressed:event.target, key:{value:event.key,target:event.target}};
    case 'keyup':
      if (!state.key || state.key.value !== event.key) return state;
      return {hover, pressed:null, pointer:null, key:null};
    case 'refresh':
    case 'move': {
      if (state.key) return {...state,hover,pressed:state.key.target};
      if (state.pointer && event.buttons !== 0) {
        return {...state, hover:hover.filter(target => state.pointer.path.includes(target)), pressed:hits.includes(state.pointer.target) ? state.pointer.target : null};
      }
      // Recover even when a platform missed pointerup but reports buttons=0.
      return {hover:event.buttons ? [] : hover, pressed:null, pointer:null, key:null};
    }
    case 'cancel': return idleGlassInput();
    default: return state;
  }
}
