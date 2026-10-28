import {useEffect,useRef,useState} from "react";
import {DndContext,DragOverlay,KeyboardSensor,MeasuringStrategy,PointerSensor,closestCorners,pointerWithin,useDroppable,useSensor,useSensors} from "@dnd-kit/core";
import {SortableContext,useSortable,verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {ArrowRight,Check,GripVertical,MoveRight} from "lucide-react";
import {Button,Card} from "../components/ui";
import {placeTask} from "./task-order.js";
import {usePreviewSettings} from "../preview/preferences.js";

function useReducedMotion(){
  const [reduce,setReduce]=useState(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(()=>{const media=window.matchMedia("(prefers-reduced-motion: reduce)");const change=()=>setReduce(media.matches);media.addEventListener("change",change);return()=>media.removeEventListener("change",change);},[]);
  return reduce;
}

function TaskCard({task,surface,registerCard,onMove,moved,dragging,overlay,handleProps,onPointerDown}){
  return <Card surface={surface} ref={registerCard} tabIndex={overlay?undefined:-1} className={"task-card"+(overlay?" task-drag-preview":"")} data-task-id={overlay?undefined:task.id} data-moved={moved||undefined} data-dragging={dragging||undefined} aria-label={task.title} aria-hidden={overlay||undefined} onPointerDown={onPointerDown}>
    <div className="task-card-top"><span className="task-tag">{task.tag}</span><span className="task-id">D-{String(task.id).padStart(2,"0")}</span><button type="button" className="task-drag-handle" data-drag-handle tabIndex={overlay?-1:0} {...handleProps} aria-label={"Переместить задачу «"+task.title+"»"} title="Переместить карточку"><GripVertical size={16} strokeWidth={1.5} aria-hidden="true"/></button></div>
    <h3>{task.title}</h3>{task.description&&<p>{task.description}</p>}
    <footer><Button variant="ghost" size="sm" tabIndex={overlay?-1:0} onClick={onMove} aria-label={(task.status==="todo"?"Начать":task.status==="doing"?"Завершить":"Вернуть")+" задачу "+task.title}>{task.status==="todo"?"В работу":task.status==="doing"?"Готово":"Вернуть"}{task.status==="doing"?<Check size={14} aria-hidden="true"/>:<ArrowRight size={14} aria-hidden="true"/>}</Button></footer>
  </Card>;
}

function SortableTask({task,surface,cardRefs,onMove,moved,reduceMotion}){
  const {setNodeRef,setActivatorNodeRef,attributes,listeners,transform,transition,isDragging}=useSortable({id:task.id,data:{type:"task",status:task.status},transition:reduceMotion?null:{duration:230,easing:"cubic-bezier(.2,.8,.2,1)"}});
  return <div className="task-sortable" data-drag-source={isDragging||undefined} ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition}}>
    <TaskCard task={task} surface={surface} registerCard={node=>{cardRefs.current[task.id]=node;}} onMove={()=>onMove(task)} moved={moved} dragging={isDragging} handleProps={{...attributes,...listeners,ref:setActivatorNodeRef}} onPointerDown={event=>{
      // Touch scroll belongs to the card body; the explicit handle starts touch drag.
      if(event.pointerType==="touch"||event.target.closest("button,a,input,textarea,select"))return;
      listeners?.onPointerDown?.(event);
    }}/>
  </div>;
}

function TaskColumn({column,items,surface,cardRefs,onMove,moved,activeId,targetColumn,reduceMotion}){
  const {setNodeRef}=useDroppable({id:"column:"+column.id,data:{type:"column",status:column.id}});
  return <section className="task-column" data-column={column.id} data-drop-target={activeId!==null&&targetColumn===column.id||undefined} ref={setNodeRef} aria-label={column.title}>
    <header><h2>{column.title}</h2><span>{items.length}</span></header>
    <SortableContext id={column.id} items={items.map(task=>task.id)} strategy={verticalListSortingStrategy}>
      <div className="task-column-body">{items.length?items.map(task=><SortableTask key={task.id} task={task} surface={surface} cardRefs={cardRefs} onMove={onMove} moved={moved?.id===task.id} reduceMotion={reduceMotion}/>):<div className="task-column-empty">{activeId!==null?<><MoveRight size={17} aria-hidden="true"/>Перетащите сюда</>:"Задач нет"}</div>}</div>
    </SortableContext>
  </section>;
}

export function TaskBoard({tasks,columns,isTaskShown,cardRefs,onMove,onFinish,moved}){
  const {surface}=usePreviewSettings();
  const [activeId,setActiveId]=useState(null),[projection,setProjection]=useState(tasks),[targetColumn,setTargetColumn]=useState(null);
  const projectionRef=useRef(tasks),snapshotRef=useRef(tasks),keyboardRef=useRef(false),inputRef=useRef(null);
  const reduceMotion=useReducedMotion();
  const view=activeId===null?tasks:projection;
  const shown=view.filter(isTaskShown);
  const activeTask=activeId===null?null:snapshotRef.current.find(task=>task.id===activeId);
  function targetStatus(over){return over?.data.current?.status;}
  function project(next){projectionRef.current=next;setProjection(next);}

  function keyboardCoordinates(event,{currentCoordinates,context}){
    const {active,over,collisionRect,droppableRects}=context;
    if(!active||!collisionRect||!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.code))return;
    event.preventDefault();
    const current=projectionRef.current.find(task=>task.id===active.id);
    if(!current)return;
    const sourceItems=projectionRef.current.filter(task=>task.status===current.status&&isTaskShown(task));
    const sourceIndex=Math.max(0,sourceItems.findIndex(task=>task.id===(over?.data.current?.type==="task"?over.id:active.id)));
    let targetId;
    if(event.code==="ArrowLeft"||event.code==="ArrowRight"){
      const columnIndex=columns.findIndex(column=>column.id===current.status)+(event.code==="ArrowRight"?1:-1);
      const nextColumn=columns[columnIndex];if(!nextColumn)return;
      const nextItems=projectionRef.current.filter(task=>task.status===nextColumn.id&&isTaskShown(task));
      targetId=nextItems[Math.min(sourceIndex,nextItems.length-1)]?.id||"column:"+nextColumn.id;
    }else{
      targetId=sourceItems[sourceIndex+(event.code==="ArrowDown"?1:-1)]?.id;
      if(targetId===active.id)targetId=sourceItems[sourceIndex+(event.code==="ArrowDown"?2:-2)]?.id;
    }
    const rect=droppableRects.get(targetId);if(!rect)return;
    const empty=String(targetId).startsWith("column:");
    return {x:currentCoordinates.x+rect.left-collisionRect.left+(empty?14:0),y:currentCoordinates.y+rect.top-collisionRect.top+(empty?62:0)};
  }
  const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:7}}),useSensor(KeyboardSensor,{coordinateGetter:keyboardCoordinates,scrollBehavior:"auto"}));
  function collision(args){
    const candidates=args.droppableContainers.filter(container=>container.id!==args.active.id);
    const options={...args,droppableContainers:candidates};
    if(args.pointerCoordinates){const hits=pointerWithin(options);const cards=hits.filter(hit=>!String(hit.id).startsWith("column:"));return cards.length?cards:hits;}
    return closestCorners(options);
  }
  function start(event){
    snapshotRef.current=tasks;keyboardRef.current=event.activatorEvent instanceof KeyboardEvent;inputRef.current=event.activatorEvent.pointerType||"keyboard";
    project(tasks);setActiveId(event.active.id);setTargetColumn(tasks.find(task=>task.id===event.active.id)?.status||null);
  }
  function over(event){
    const status=targetStatus(event.over);setTargetColumn(status||null);
    const current=projectionRef.current.find(task=>task.id===event.active.id);
    if(!current||!status||current.status===status)return;
    const below=event.over.data.current?.type==="task"&&event.active.rect.current.translated?.top>event.over.rect.top+event.over.rect.height/2;
    project(placeTask(projectionRef.current,current.id,status,event.over.data.current?.type==="task"?event.over.id:null,below));
  }
  function finish(event,cancelled=false){
    let next=projectionRef.current;
    if(cancelled||!event.over){next=snapshotRef.current;cancelled=true;}
    else{
      const status=targetStatus(event.over);
      if(event.over.data.current?.type==="task"){
        const source=next.findIndex(task=>task.id===event.active.id),target=next.findIndex(task=>task.id===event.over.id);
        next=placeTask(next,event.active.id,status,event.over.id,source<target);
      }else if(status){
        const current=next.find(task=>task.id===event.active.id);
        const last=next.filter(task=>task.status===status&&task.id!==event.active.id&&isTaskShown(task)).at(-1);
        const lastRect=last&&cardRefs.current[last.id]?.getBoundingClientRect();
        const belowLast=lastRect&&event.active.rect.current.translated?.top>lastRect.bottom-12;
        // A column also receives hits over the active card's own placeholder.
        // Keep that previewed slot; only append when actually below the last card.
        if(current?.status!==status||!last||belowLast)next=placeTask(next,event.active.id,status);
      }
    }
    const changed=next.some((task,index)=>task.id!==snapshotRef.current[index]?.id||task.status!==snapshotRef.current[index]?.status);
    setActiveId(null);setTargetColumn(null);project(next);
    onFinish({tasks:next,id:event.active.id,keyboard:keyboardRef.current,changed,cancelled});
  }
  const announcement=({active,over})=>{
    const task=snapshotRef.current.find(item=>item.id===active.id),status=targetStatus(over);
    return status?"Задача «"+task?.title+"». Колонка «"+columns.find(column=>column.id===status)?.title+"».":"Задача вне области переноса.";
  };
  return <>
    <p className="task-drag-help"><GripVertical size={14} aria-hidden="true"/>Перетащите карточку в нужную колонку</p>
    <DndContext sensors={sensors} collisionDetection={collision} measuring={{droppable:{strategy:MeasuringStrategy.Always}}} onDragStart={start} onDragOver={over} onDragEnd={event=>finish(event)} onDragCancel={event=>finish(event,true)} accessibility={{restoreFocus:false,screenReaderInstructions:{draggable:"Нажмите Пробел, чтобы поднять карточку. Стрелки влево и вправо меняют колонку, вверх и вниз — позицию. Пробел — отпустить, Escape — отменить."},announcements:{onDragStart:({active})=>"Поднята задача «"+tasks.find(task=>task.id===active.id)?.title+"».",onDragOver:announcement,onDragEnd:({over})=>over?"Карточка отпущена.":"Перемещение отменено.",onDragCancel:()=>"Перемещение отменено."}}}>
      <div className="task-board" data-dragging={activeId!==null||undefined} data-last-drag-input={inputRef.current||undefined}>{columns.map(column=><TaskColumn key={column.id} column={column} items={shown.filter(task=>task.status===column.id)} surface={surface} cardRefs={cardRefs} onMove={onMove} moved={moved} activeId={activeId} targetColumn={targetColumn} reduceMotion={reduceMotion}/>)}</div>
      <DragOverlay dropAnimation={reduceMotion?null:{duration:230,easing:"cubic-bezier(.2,.8,.2,1)"}} zIndex={30}>{activeTask?<TaskCard task={activeTask} surface={surface} overlay/>:null}</DragOverlay>
    </DndContext>
  </>;
}
