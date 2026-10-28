import {lazy,Suspense} from 'react';
const pages={charts:lazy(()=>import('./ChartVariants.jsx')),cards:lazy(()=>import('./CardVariants.jsx')),blocks:lazy(()=>import('./BlockVariants.jsx')),fields:lazy(()=>import('./FieldVariants.jsx')),navigation:lazy(()=>import('./NavigationVariants.jsx'))};
export default function VariantLibrary({page}) {const Page=pages[page];return Page?<Suspense fallback={<div className="chart-loading" role="status">Собираем варианты…</div>}><Page/></Suspense>:null;}
