import {ArrowUpRight} from 'lucide-react';
import {variantDefinitions,variantPageNames} from './definitions.js';
import './variants.css';
const plural=new Intl.PluralRules('ru');
const endings={one:'вариант',few:'варианта',many:'вариантов',other:'варианта'};
export function VariantIndex(){return <nav className="variant-index" aria-label="Галереи вариантов">{Object.entries(variantDefinitions).map(([page,items])=><a href={'#'+page} key={page}><span>{variantPageNames[page]}<small>+{items.length} {endings[plural.select(items.length)]}</small></span><ArrowUpRight size={13} aria-hidden="true"/></a>)}</nav>;}
