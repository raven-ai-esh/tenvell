export const monthlyRows = [
  {month:'Май',a:186,b:80,plan:220},{month:'Июн',a:240,b:110,plan:220},
  {month:'Июл',a:175,b:95,plan:220},{month:'Авг',a:295,b:135,plan:220},
  {month:'Сен',a:220,b:105,plan:220},{month:'Окт',a:310,b:160,plan:220},
];
export const segmentRows = [{name:'Документы',value:310,fill:'var(--chart-1)'},{name:'Заметки',value:160,fill:'var(--chart-2)'},{name:'Макеты',value:74,fill:'var(--chart-3)'}];
export const radialRows = [{name:'Документы',value:82,fill:'var(--chart-1)'},{name:'Заметки',value:64,fill:'var(--chart-2)'},{name:'Макеты',value:45,fill:'var(--chart-3)'}];
export const radarRows = [{name:'Ясность',a:82,b:64},{name:'Ритм',a:61,b:78},{name:'Детали',a:74,b:55},{name:'Контраст',a:57,b:72},{name:'Состав',a:88,b:67}];
export function percentRows(rows,keys=['a','b']) {
  return rows.map(row=>{
    for(const key of keys) if(!Number.isFinite(row[key]) || row[key]<0) throw new RangeError('Shares require non-negative finite values');
    const total=keys.reduce((sum,key)=>sum+row[key],0);
    return {...row,...Object.fromEntries(keys.map(key=>[key,total?row[key]/total*100:0]))};
  });
}
export const files = [
  {id:'F-01',title:'Описание интерфейса',kind:'Документ',size:240,updated:6},
  {id:'F-02',title:'Набор иконок',kind:'Макет',size:560,updated:5},
  {id:'F-03',title:'Заметки к встрече',kind:'Заметка',size:18,updated:4},
  {id:'F-04',title:'Сетка отступов',kind:'Макет',size:126,updated:3},
  {id:'F-05',title:'Тексты состояний',kind:'Документ',size:42,updated:2},
  {id:'F-06',title:'Следующие шаги',kind:'Заметка',size:12,updated:1},
];
export function filterFiles(rows,query='',sort='recent',translate=value=>value) {
  const term=query.trim().toLocaleLowerCase('ru');
  return rows.filter(row=>(row.title+' '+translate(row.title)+' '+row.kind+' '+translate(row.kind)+' '+row.id).toLocaleLowerCase('ru').includes(term)).sort(sort==='name'?(a,b)=>translate(a.title).localeCompare(translate(b.title),'ru'):(a,b)=>b.updated-a.updated);
}
export const plans=[
  {id:'basic',name:'Базовый',monthly:0,yearlyMonthly:0,description:'Для небольшого личного набора.',features:['3 коллекции','Основные компоненты','Один участник']},
  {id:'plus',name:'Плюс',monthly:290,yearlyMonthly:240,description:'Для регулярной совместной работы.',features:['20 коллекций','Все варианты','5 участников']},
  {id:'pro',name:'Команда',monthly:590,yearlyMonthly:490,description:'Для общего рабочего пространства.',features:['Без ограничения коллекций','Общие настройки','15 участников']},
];
export function planPrice(plan,cycle) {const monthly=cycle==='year'?plan.yearlyMonthly:plan.monthly;return {monthly,total:cycle==='year'?monthly*12:monthly};}
export function stepQuantity(value,delta) {const numeric=Number(value),current=Number.isFinite(numeric)?numeric:0;return Math.max(0,Math.min(99,delta>0?Math.floor(current)+1:Math.ceil(current)-1));}
export function nextChartIndex(current,key,count) {const last=Math.max(0,count-1),index=Math.max(0,Math.min(last,current));if(key==='Home')return 0;if(key==='End')return last;if(key==='ArrowDown'||key==='ArrowRight')return Math.min(last,index+1);if(key==='ArrowUp'||key==='ArrowLeft')return Math.max(0,index-1);return index;}
export function dayKey(date) {return date?[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-'):'';}
export const notifications=[
  {id:'N-1',title:'Обновлён макет',description:'В коллекции появилась новая версия.',time:'10:40',unread:true},
  {id:'N-2',title:'Приглашён участник',description:'Состав демонстрационной команды изменён.',time:'09:20',unread:true},
  {id:'N-3',title:'Коллекция сохранена',description:'Все изменения находятся на месте.',time:'Вчера',unread:false},
];
