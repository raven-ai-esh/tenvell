export const taskStatuses=["todo","doing","done"];

// Only the moved item changes status. All other items keep their relative order,
// including tasks hidden by a filter or search.
export function placeTask(tasks,id,status,targetId=null,after=false) {
  const moving=tasks.find(task=>task.id===id);
  if(!moving||!taskStatuses.includes(status)||targetId===id)return tasks;
  const rest=tasks.filter(task=>task.id!==id);
  const target=rest.findIndex(task=>task.id===targetId&&task.status===status);
  const last=rest.findLastIndex(task=>task.status===status);
  const index=target>=0?target+(after?1:0):last>=0?last+1:rest.length;
  const next=[...rest];next.splice(index,0,{...moving,status});
  if(next.every((task,i)=>task.id===tasks[i].id&&task.status===tasks[i].status))return tasks;
  return next;
}
