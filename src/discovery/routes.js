export const discoveryPages = [
  {
    slug: 'react-glassmorphism-ui-kit',
    keywords: ['React UI kit', 'glassmorphism', 'frosted glass', 'scoped CSS'],
    en: { title: 'React glassmorphism UI kit — tenvell', shortTitle: 'Glass interfaces', heading: 'Glassmorphism UI kit for React.', description: 'Build React 19 interfaces with thin-glass cards, forms and dialogs. Four glass surfaces, scoped CSS, local Lamina fonts and MIT-licensed source.' },
    ru: { title: 'Стеклянный UI kit для React — tenvell', shortTitle: 'Стеклянные интерфейсы', heading: 'Стеклянный дизайн-кит для React.', description: 'Тонкое стекло для интерфейсов на React 19: карточки, формы и диалоги, четыре поверхности, изолированные стили, локальные шрифты и исходники MIT.' },
  },
  {
    slug: 'react-dashboard-ui-kit',
    keywords: ['React dashboard UI kit', 'settings forms', 'metric cards', 'Recharts'],
    en: { title: 'React dashboard UI kit for product screens — tenvell', shortTitle: 'Dashboards and settings', heading: 'A React UI kit for dashboards and settings.', description: 'Compose React 19 dashboards and settings screens with tenvell cards, fields, dialogs and optional Recharts shapes. Explore the live product example and API scope.' },
    ru: { title: 'UI kit для дашбордов и настроек на React — tenvell', shortTitle: 'Дашборды и настройки', heading: 'Дашборды и настройки на React.', description: 'Собирайте экраны на React 19 из карточек, полей и диалогов tenvell. Пример дашборда, графики Recharts и точные границы переносимого API.' },
  },
  {
    slug: 'shadcn-glass-components',
    keywords: ['shadcn glass components', 'React', 'editable source', 'component registry'],
    en: { title: 'Editable glass components for shadcn — tenvell', shortTitle: 'shadcn components', heading: 'Glass components for shadcn projects.', description: 'Add editable React glass components with the shadcn CLI. Start with one button or the complete tenvell UI kit, with scoped CSS and original local fonts.' },
    ru: { title: 'Стеклянные компоненты для shadcn — tenvell', shortTitle: 'Компоненты shadcn', heading: 'Стеклянные компоненты через shadcn.', description: 'Добавьте редактируемые React-компоненты tenvell через shadcn CLI: рабочий пример кнопки или всё ядро, стили в своей области и локальные шрифты.' },
  },
  {
    slug: 'choosing-a-react-ui-kit',
    keywords: ['choose React UI kit', 'design system', 'component library', 'UI kit comparison'],
    en: { title: 'Choosing a React UI kit: style, source and scope — tenvell', shortTitle: 'Choose a UI kit', heading: 'Choose a React UI kit around your product.', description: 'Compare the roles of tenvell, shadcn/ui, Material UI and React Aria. Choose a React UI kit by visual style, source ownership, component scope and compatibility.' },
    ru: { title: 'Как выбрать UI kit для React — tenvell и другие подходы', shortTitle: 'Выбор дизайн-кита', heading: 'Как выбрать дизайн-кит для React.', description: 'Tenvell, shadcn/ui, Material UI и React Aria: сравните визуальный стиль, владение исходниками, набор компонентов и совместимость со своим продуктом.' },
  },
];

export function discoveryRoute(pathname) {
  const clean = pathname.replace(/\.html$/, '').replace(/\/$/, '');
  const locale = clean.startsWith('/ru/') ? 'ru' : 'en';
  const slug = clean.replace(/^\/ru\//, '').replace(/^\//, '');
  const page = discoveryPages.find(page => page.slug === slug);
  return page ? { page, locale, path: (locale === 'ru' ? '/ru/' : '/') + slug } : null;
}

export function discoveryHref(page, locale = 'en') {
  return (locale === 'ru' ? '/ru/' : '/') + page.slug;
}

export const discoveryDocuments = discoveryPages.flatMap(page => ['en', 'ru'].map(locale => ({
  ...page[locale], path: discoveryHref(page, locale), language: locale, guide: true,
  descriptionRu: page.ru.description, titleRu: page.ru.title, keywords: page.keywords,
  markdown: '/docs/discovery/' + (locale === 'ru' ? 'ru/' : '') + page.slug + '.md',
  alternates: { en: discoveryHref(page, 'en'), ru: discoveryHref(page, 'ru') },
})));
