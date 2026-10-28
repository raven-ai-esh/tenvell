import {getIntlLocale} from './language.js';

export const localizedNumberFormat=options=>({format:value=>new Intl.NumberFormat(getIntlLocale(),options).format(value)});
export const localizedDateFormat=options=>({format:value=>new Intl.DateTimeFormat(getIntlLocale(),options).format(value)});
export const localizedPluralRules=options=>({select:value=>new Intl.PluralRules(getIntlLocale(),options).select(value)});
