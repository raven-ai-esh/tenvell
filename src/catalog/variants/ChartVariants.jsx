import {t} from "../../i18n/translate.js";
import {VariantGallery} from './VariantGallery.jsx';
import {variantDefinitions} from './definitions.js';
import {VariantChart} from './ChartVariantPlot.jsx';
export default function ChartVariants(){return <VariantGallery page="charts" items={variantDefinitions.charts} render={item=><VariantChart variant={item.id}/>} code={item=>'import { VariantChart } from "./catalog/variants/ChartVariantPlot.jsx";\n\n<VariantChart variant="'+item.id+'" />\n\n// Необязательно: data={yourData}.\n// Общие подсказки, стеклянные формы и клавиатура уже включены.'}/>;}
