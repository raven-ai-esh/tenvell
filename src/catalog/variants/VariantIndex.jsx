import {t} from "../../i18n/translate.js";
import {localeHref} from "../../i18n/language.js";
import {localizedNumberFormat,localizedDateFormat,localizedPluralRules} from "../../i18n/format.js";
import {ArrowUpRight} from 'lucide-react';
import {variantDefinitions,variantPageNames} from './definitions.js';
import './variants.css';
const plural=localizedPluralRules();
const endings={one:'вариант',few:'варианта',many:'вариантов',other:'варианта'};
export function VariantIndex(){return <nav className="variant-index" aria-label={t("Галереи вариантов")}>{Object.entries(variantDefinitions).map(([page,items])=><a href={localeHref('#'+page)} key={page}><span>{t(variantPageNames[page])}<small>+{t(items.length)} {t(endings[plural.select(items.length)])}</small></span><ArrowUpRight size={13} aria-hidden="true"/></a>)}</nav>;}
