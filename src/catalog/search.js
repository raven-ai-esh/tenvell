export function searchCatalog(pages,query='',translate=value=>value) {
  const term=query.trim().toLocaleLowerCase('ru');
  return pages.flatMap(page=>{
    const base={...page,key:page.id,target:page.id};
    if(!term)return [base];
    const pageMatch=(page.title+' '+translate(page.title)+' '+page.english+' '+page.keywords+' '+translate(page.keywords)).toLocaleLowerCase('ru').includes(term);
    const examples=page.examples.filter(item=>(item.title+' '+translate(item.title)+' '+item.id).toLocaleLowerCase('ru').includes(term));
    return [...(pageMatch?[base]:[]),...examples.map(item=>({...page,key:page.id+'/'+item.id,target:page.id+'/'+item.id,matchTitle:item.title}))];
  });
}
