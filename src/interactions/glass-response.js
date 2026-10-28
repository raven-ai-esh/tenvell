import {useEffect} from 'react';
import {glassMotion} from './glass-motion.js';
import {idleGlassInput,reduceGlassInput} from './glass-input-state.js';
import './glass-response.css';

const candidates = 'button,a[href],summary,[role="button"],[role="tab"],[role="option"],[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"],[role="checkbox"],[role="switch"],.card,.conversation-item,.ui-table tbody tr,.ui-radio-option,.input,.ui-input-group,.ui-combobox-control,[data-glass-chart]';
const blocked = ':disabled,[aria-disabled="true"],[data-disabled],[aria-busy="true"],[inert],[hidden],.task-drag-preview';
const editingSelector = 'input:not([type="radio"]):not([type="checkbox"]):not([type="range"]),textarea,[contenteditable="true"]';
const pressable = 'button,a[href],summary,[role="button"],[role="tab"],[role="option"],[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"],[role="checkbox"],[role="switch"],.ui-radio-option,.task-card';
const controllers = new Map();

function installResponse(scope,portal) {
  const isDocument=scope===document;
  const roots=()=>isDocument?[document]:[scope,portal].filter(Boolean);
  const inputRoots=isDocument?[document.documentElement]:roots();
  const previousInput=new Map(inputRoots.map(element=>[element,element.getAttribute('data-glass-input')]));
  const inputMode=value=>{for(const element of inputRoots)element.dataset.glassInput=value;};
  const owns=element=>element instanceof Element&&(isDocument?!element.closest('[data-tenvell]'):roots().some(root=>root.contains(element))&&(!element.closest('[data-tenvell]')||roots().includes(element.closest('[data-tenvell]'))));
  const query=selector=>roots().flatMap(root=>[...root.querySelectorAll(selector)]);
  let state = idleGlassInput(), point = null, frame = 0, scanFrame = 0, pressed = null;
  const hovered = new Map(), marked = new Map();
  const restore=(element,attributes)=>{for(const [name,value] of Object.entries(attributes)){if(value===null)element.removeAttribute(name);else element.setAttribute(name,value);}};
  const prune=()=>{for(const [element,attributes] of marked)if(!element.isConnected){restore(element,attributes);marked.delete(element);}};
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mark = element => {
    if (!owns(element) || element.closest('[inert],[hidden],.task-drag-preview')) return;
    if(!marked.has(element))marked.set(element,Object.fromEntries(['data-glass-response','data-glass-paint','data-glass-position'].map(name=>[name,element.getAttribute(name)])));
    if (element.matches('.ui-combobox-trigger') || element.matches('.input') && element.closest('.ui-input-group,.ui-combobox-control')) {
      element.removeAttribute('data-glass-response');element.removeAttribute('data-glass-paint');return;
    }
    if (element instanceof SVGElement || element.matches('input[type="hidden"]')) return;
    const kind = element.matches('.input,.ui-input-group,.ui-combobox-control,.select-trigger') ? 'field'
      : element.matches('.card') ? 'surface' : element.matches('tr,.conversation-item') ? 'row' : 'control';
    element.setAttribute('data-glass-response',kind);
    if (kind === 'field' || element.tagName === 'TR') element.removeAttribute('data-glass-paint');
    else {
      element.setAttribute('data-glass-paint','');
      if (getComputedStyle(element).position === 'static') element.setAttribute('data-glass-position','');
    }
  };
  const scan = () => {scanFrame = 0;prune();query(candidates).forEach(mark);};
  const eligible = element => {
    if (!owns(element) || !element.isConnected || !element.getClientRects().length || element.closest('.task-board[data-dragging]')) return false;
    // Decorative SVG hit paths remain available to the pointer.
    return element.matches('[data-glass-chart]') ? !element.closest('[inert],[hidden]') : !element.closest(blocked);
  };
  const collect = start => {
    const targets = [];
    const visited = new Set();
    const ascend = startNode => {
      for (let element = startNode; element instanceof Element && !visited.has(element); element = element.parentElement) {
        visited.add(element);
        if (owns(element) && element.matches(candidates)) {
          if (!element.matches('[data-glass-chart]')) mark(element);
          if ((element.hasAttribute('data-glass-response') || element.hasAttribute('data-glass-chart')) && eligible(element) && !targets.includes(element)) targets.push(element);
        }
        // Anchored menus/listboxes live in portals but remain children of their owner.
        if (element.id && element.matches('[role="menu"],[role="listbox"],.ui-popover:not([aria-modal="true"])')) {
          for (const owner of query('[aria-controls][aria-expanded="true"]')) {
            if (owner.getAttribute('aria-controls').split(/\s+/).includes(element.id)) ascend(owner);
          }
        }
      }
    };
    ascend(start);
    return targets;
  };
  const hitsAtPoint = () => point ? collect(document.elementFromPoint(point.x,point.y)) : [];
  const canHover = () => Boolean(point && fine.matches && point.type !== 'touch');
  const removeHover = element => {
    element.removeAttribute('data-glass-hover');
    for (const name of ['x','y','tilt','light-x','light-y']) element.style.removeProperty('--gr-'+name);
    hovered.delete(element);
  };
  const paint = () => {
    const next = new Set(state.hover.filter(eligible));
    const editingTargets = document.activeElement.matches(editingSelector) ? new Set(collect(document.activeElement)) : new Set();
    for (const element of hovered.keys()) if (!next.has(element)) removeHover(element);
    for (const element of next) {
      if (!hovered.has(element)) {
        const plane = element.matches('[data-glass-chart]') ? element.querySelector('[data-glass-hit]') || element : element;
        hovered.set(element,plane.getBoundingClientRect());
        element.setAttribute('data-glass-hover','');
      }
      // Retain the parent's existing pose during a child press/drag gesture.
      if (!point || state.pointer && point.buttons || state.key) continue;
      const kind = element.dataset.glassResponse || 'chart';
      const editing = editingTargets.has(element);
      const motion = glassMotion(hovered.get(element),{x:point.x,y:point.y},{kind,reduced:reduced.matches,editing});
      for (const [name,value] of Object.entries({x:motion.x+'px',y:motion.y+'px',tilt:motion.tilt+'deg','light-x':motion.lightX+'%','light-y':motion.lightY+'%'})) element.style.setProperty('--gr-'+name,value);
    }
    const nextPressed = state.pressed && eligible(state.pressed) ? state.pressed : null;
    if (pressed !== nextPressed) {
      pressed?.removeAttribute('data-glass-pressed');
      pressed = nextPressed;
      pressed?.setAttribute('data-glass-pressed',state.key ? 'keyboard' : 'pointer');
    }
  };
  const dispatch = event => {state = reduceGlassInput(state,event);paint();};
  const refresh = () => {
    frame = 0;
    if (state.key && !eligible(state.key.target)) state = idleGlassInput();
    const hits = hitsAtPoint();
    dispatch({type:'refresh',hits,canHover:canHover(),buttons:point?.buttons || 0});
  };
  const schedule = () => {if (!frame) frame = requestAnimationFrame(refresh);};
  const remember = event => {point = {x:event.clientX,y:event.clientY,type:event.pointerType,buttons:event.buttons};};
  const move = event => {remember(event);schedule();};
  const down = event => {
    remember(event);
    if (event.button !== 0) return;
    const hits = hitsAtPoint();
    if(!isDocument&&!owns(event.target)&&!hits.length)return;
    if(isDocument||owns(event.target))inputMode('pointer');
    const target = hits.find(element => element.matches(pressable) && element.dataset.glassResponse !== 'field') || null;
    dispatch({type:'down',id:event.pointerId,target,hits,canHover:canHover()});
    schedule();
  };
  const up = event => {
    remember(event);
    dispatch({type:'up',id:event.pointerId,hits:hitsAtPoint(),canHover:canHover()});
    // Re-hit-test after click handlers, portals, navigation and disabled-state changes.
    schedule();
  };
  const cancel = () => {point = null;dispatch({type:'cancel'});};
  // A replaced SVG child also emits pointerout with relatedTarget=null.
  // Only leaving the document root ends the complete hover path.
  const leave = event => {if(!isDocument&&(owns(event.relatedTarget)||collect(event.relatedTarget).length))return;point = null;dispatch({type:'move',hits:[],buttons:state.pointer ? 1 : 0,canHover:false});};
  const keydown = event => {
    if(!isDocument&&!owns(event.target))return;
    if (!['Shift','Control','Alt','Meta'].includes(event.key)) inputMode('keyboard');
    if (event.key === 'Escape') {dispatch({type:'cancel'});schedule();return;}
    if (event.repeat || ![' ','Enter'].includes(event.key) || !(event.target instanceof Element) || event.target.matches(editingSelector)) return;
    const target = collect(event.target).find(element => element.matches(pressable) && element.dataset.glassResponse !== 'field');
    dispatch({type:'keydown',key:event.key,target});
  };
  const keyup = event => {dispatch({type:'keyup',key:event.key,hits:hitsAtPoint(),canHover:canHover()});schedule();};
  const lostCapture = event => {if (state.pointer?.id === event.pointerId) cancel();};
  const scroll = () => {for (const element of hovered.keys()) removeHover(element);schedule();};
  const visibility = () => {if (document.hidden) cancel();};
  const observer = new MutationObserver(records => {
    if (records.some(record => record.type === 'childList') && !scanFrame) scanFrame = requestAnimationFrame(scan);
    // A bar can be reparented, or a button can become enabled, under a still pointer.
    schedule();
  });
  scan();
  for(const root of isDocument?[document.body]:roots())observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','aria-disabled','aria-busy','aria-expanded','aria-hidden','data-disabled','data-dragging','inert','hidden']});
  const listeners = [
    ['pointermove',move,true],['pointerover',move,true],['pointerdown',down,true],['pointerup',up,true],['pointercancel',cancel,true],
    ['lostpointercapture',lostCapture,true],['keydown',keydown,true],['keyup',keyup,true],
    ['focusin',schedule,true],['focusout',schedule,true],['scroll',scroll,true],['visibilitychange',visibility,false],
  ];
  for (const [name,listener,capture] of listeners) document.addEventListener(name,listener,{capture,passive:true});
  for(const root of isDocument?[document.documentElement]:roots())root.addEventListener('pointerleave',leave,{passive:true});
  window.addEventListener('blur',cancel);window.addEventListener('resize',scroll);
  fine.addEventListener('change',cancel);reduced.addEventListener('change',refresh);
  return () => {
    cancel();observer.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(scanFrame);
    for (const [name,listener,capture] of listeners) document.removeEventListener(name,listener,capture);
    for(const root of isDocument?[document.documentElement]:roots())root.removeEventListener('pointerleave',leave);
    window.removeEventListener('blur',cancel);window.removeEventListener('resize',scroll);
    fine.removeEventListener('change',cancel);reduced.removeEventListener('change',refresh);
    for(const [element,attributes] of marked)restore(element,attributes);
    for(const [element,value] of previousInput){if(value===null)element.removeAttribute('data-glass-input');else element.setAttribute('data-glass-input',value);}
  };
}

export function useGlassResponse(scopeRef,enabled=true,portal=null) {
  useEffect(() => {
    const scope=scopeRef?scopeRef.current:document;
    if(!scope||!enabled)return;
    let controller=controllers.get(scope);
    if(!controller){controller={consumers:0,dispose:installResponse(scope,portal)};controllers.set(scope,controller);}
    controller.consumers++;
    return () => {if(--controller.consumers===0){controller.dispose();controllers.delete(scope);}};
  },[scopeRef,enabled,portal]);
}

if (import.meta.hot) import.meta.hot.dispose(() => {for(const controller of controllers.values())controller.dispose();controllers.clear();});
