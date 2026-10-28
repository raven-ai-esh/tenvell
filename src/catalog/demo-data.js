export const collectionRows=[
 {id:"D-001",title:"Обзор коллекции",type:"Документ",status:"ready",size:128},
 {id:"D-002",title:"Первые наброски",type:"Макет",status:"draft",size:640},
 {id:"D-003",title:"Спокойный ритм",type:"Заметка",status:"review",size:24},
 {id:"D-004",title:"Палитра света",type:"Макет",status:"ready",size:256},
 {id:"D-005",title:"Сетка и отступы",type:"Документ",status:"review",size:96},
 {id:"D-006",title:"Формы и состояния",type:"Макет",status:"draft",size:480},
 {id:"D-007",title:"Короткий сценарий",type:"Заметка",status:"ready",size:18},
 {id:"D-008",title:"Набор деталей",type:"Документ",status:"ready",size:144},
 {id:"D-009",title:"Иконки и подписи",type:"Макет",status:"review",size:320},
 {id:"D-010",title:"Небольшой экран",type:"Макет",status:"draft",size:512},
 {id:"D-011",title:"Проверка контраста",type:"Документ",status:"ready",size:72},
 {id:"D-012",title:"Типографика",type:"Документ",status:"review",size:84},
 {id:"D-013",title:"Финальные заметки",type:"Заметка",status:"draft",size:16},
 {id:"D-014",title:"Тихая композиция",type:"Макет",status:"ready",size:384},
];
export const rowStatuses={ready:{label:"Готово",tone:"success"},draft:{label:"Черновик",tone:"neutral"},review:{label:"На проверке",tone:"warning"}};
export function filterSortRows(rows,query,sort={key:"title",direction:"asc"}){const q=query.trim().toLocaleLowerCase("ru");return rows.filter(row=>(row.title+" "+row.type+" "+row.id).toLocaleLowerCase("ru").includes(q)).toSorted((a,b)=>{const delta=sort.key==="size"?a.size-b.size:a.title.localeCompare(b.title,"ru");return (delta||a.id.localeCompare(b.id))*(sort.direction==="desc"?-1:1);});}
export const activityData=[{month:"Май",value:42},{month:"Июн",value:68},{month:"Июл",value:51},{month:"Авг",value:76},{month:"Сен",value:58},{month:"Окт",value:84}];
