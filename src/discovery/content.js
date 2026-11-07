export const guideContent = {
  'react-glassmorphism-ui-kit': {
    preview: 'button', code: 'provider',
    en: {
      lead: 'Tenvell gives glassmorphism a consistent set of React components: thin edges, translucent surfaces, readable controls and a quiet hover-to-press response. The same material runs through cards, fields, menus and dialogs.',
      sections: [
        { title: 'One material across your interface', paragraphs: ['Use air, frost, prism or smoke surfaces in light or dark themes. TenvellProvider keeps the settings in one scope, including its portalled dialogs and menus. Several providers can coexist on the same page.', 'Lamina UI and Lamina Mono are included locally. The component CSS is ordinary CSS with native scope boundaries; you can use it alongside the rest of your application without adopting a utility-class design system.'] },
        { title: 'Start with a real control', paragraphs: ['The button below is the same source-first example offered by the registry. It includes a provider, local styles, click feedback and an independent light/dark setting. The API reference lists the exact props and exports of the current package.'] },
        { title: 'Choose the surface for the content', paragraphs: ['Start with a restrained surface and check text and control contrast against the actual backdrop of your screen. Keep the application background and layout outside the provider. Tenvell supplies the UI material; the application supplies its content and behavior.'] },
      ],
      fitTitle: 'A useful fit when', fit: ['Your application uses React and React DOM 19.', 'You want a thin-glass visual language for forms, cards and product controls.', 'You want editable source or an ESM package with scoped styles and local fonts.'],
      scopeTitle: 'Check before choosing', scope: ['The CSS requires modern @scope and backdrop-filter support.', 'The kit does not include optical lens simulation or a native mobile rendering layer.', 'Check the actual product flow for contrast, keyboard behavior and assistive-technology needs.'],
      questions: [
        { question: 'Does tenvell require Tailwind?', answer: 'No. Its components use ordinary CSS. Source-first installation uses the shadcn CLI as a distribution tool.' },
        { question: 'Can different areas use different themes?', answer: 'Yes. Each TenvellProvider owns its theme, surface, accent, radius, density and motion settings.' },
        { question: 'How is the kit licensed?', answer: 'Own code is MIT licensed. The original Lamina fonts use SIL OFL 1.1; keep the bundled notices when distributing copies.' },
      ],
      links: [{ href: '/#cards', label: 'Explore live cards and surfaces' }, { href: '/docs/api.md', label: 'Read the published API' }, { href: '/typeface.html', label: 'See the Lamina typefaces' }],
    },
    ru: {
      lead: 'Tenvell объединяет glassmorphism в набор React-компонентов: тонкие кромки, прозрачные поверхности, читаемые элементы управления и спокойный отклик на наведение и нажатие. Один материал используется в карточках, полях, меню и диалогах.',
      sections: [
        { title: 'Один материал для всего интерфейса', paragraphs: ['Выберите поверхность air, frost, prism или smoke и светлую либо тёмную тему. TenvellProvider сохраняет настройки в своей области, включая диалоги и меню в порталах. Несколько провайдеров могут находиться на одной странице.', 'Lamina UI и Lamina Mono поставляются локально. Компоненты используют обычный CSS с границами области: их можно подключить к своему приложению, сохранив остальную систему оформления.'] },
        { title: 'Начните с рабочего элемента', paragraphs: ['Ниже — тот же пример кнопки, который устанавливается из registry. В нём есть провайдер, стили, счётчик нажатий и собственная смена темы. Точные свойства и экспорты опубликованного пакета перечислены в справочнике API.'] },
        { title: 'Подберите поверхность под содержимое', paragraphs: ['Начните со сдержанной поверхности и проверьте читаемость текста и границ элементов на реальном фоне экрана. Фон и раскладка приложения остаются за пределами провайдера. Tenvell задаёт материал элементов, а приложение — их содержимое и поведение.'] },
      ],
      fitTitle: 'Подойдёт, если', fit: ['Приложение использует React и React DOM 19.', 'Для форм, карточек и элементов продукта нужен визуальный язык тонкого стекла.', 'Важны редактируемые исходники или ESM-пакет, стили в своей области и локальные шрифты.'],
      scopeTitle: 'Что проверить при выборе', scope: ['CSS требует поддержки современных @scope и backdrop-filter.', 'В набор не входят оптическая симуляция линз и нативный мобильный рендерер.', 'Проверьте контраст, работу с клавиатурой и вспомогательными технологиями в своём сценарии.'],
      questions: [
        { question: 'Нужен ли Tailwind?', answer: 'Нет. Компоненты используют обычный CSS. Shadcn CLI служит способом распространения редактируемых исходников.' },
        { question: 'Можно ли использовать разные темы на одном экране?', answer: 'Да. У каждого TenvellProvider свои theme, surface, accent, radius, density и motion.' },
        { question: 'Какая у набора лицензия?', answer: 'Собственный код распространяется по MIT, оригинальные шрифты Lamina — по SIL OFL 1.1. При распространении копий сохраняйте уведомления о лицензиях.' },
      ],
      links: [{ href: '/#cards', label: 'Посмотреть карточки и поверхности' }, { href: '/docs/api.md', label: 'Открыть API пакета' }, { href: '/typeface.html', label: 'Посмотреть шрифты Lamina' }],
    },
  },
  'react-dashboard-ui-kit': {
    preview: 'starter', code: 'dashboard',
    en: {
      lead: 'Build a dashboard or settings screen from the same tenvell controls used in the live catalog: metric cards, inputs, selection controls, tabs, menus and dialogs. The thin-glass surfaces and local typography give these pieces a shared visual language.',
      sections: [
        { title: 'Compose the screen from documented primitives', paragraphs: ['Use the Card family for metrics and grouped settings, Input and Select for filters, Tabs for local navigation and Dialog for detail views. Keep the product layout and data model in your application.', 'The full dashboard example demonstrates a composed product screen with fictional data. Its source is available in GitHub. The portable core is the documented component set; the complete dashboard is not a standalone package export.'] },
        { title: 'Add charts when the screen needs them', paragraphs: ['Optional GlassBar, GlassDot and GlassSector shapes work with Recharts 3. Give responsive charts a nonzero height and keep Tooltip cursor={false} so highlighting follows the actual element.', 'The downloadable starter already includes a chart, local notes and a checklist. It is a runnable application with locked dependencies and the published tenvell tarball.'] },
        { title: 'Keep business behavior explicit', paragraphs: ['A UI kit supplies controls and presentation. Connect filters, saving, loading states and data access to the actual product requirements. The demonstrations keep changes in local state and do not provide a production API or database.'] },
      ],
      fitTitle: 'A useful fit when', fit: ['You are building a React 19 product dashboard, settings screen or internal tool.', 'You want cards, controls and overlays to share a calm glass material.', 'You want to own the layout, data model and source code.'],
      scopeTitle: 'Know the export boundary', scope: ['The website Calendar, DataTable and toast examples are not core package exports.', 'The full dashboard, messenger and task board are source demonstrations.', 'Recharts is a separate optional dependency; the core can be installed without it.'],
      questions: [
        { question: 'Is this a complete admin framework?', answer: 'Tenvell is a UI kit. Routing, authorization, persistence and business workflows belong to the consumer application.' },
        { question: 'Can I begin with a running application?', answer: 'Yes. The starter archive includes the package, a lockfile and an editable screen. Follow the installation guide to run npm ci and npm run dev.' },
      ],
      links: [{ href: '/examples/dashboard', label: 'Open the live dashboard' }, { href: '/docs/recipes.md', label: 'Read working form and chart recipes' }, { href: 'https://github.com/raven-ai-esh/tenvell/tree/main/src/examples', label: 'Browse the product example source' }],
    },
    ru: {
      lead: 'Соберите дашборд или экран настроек из тех же элементов tenvell, что работают в каталоге: карточек метрик, полей, переключателей, вкладок, меню и диалогов. Тонкое стекло и локальная типографика связывают их в один визуальный язык.',
      sections: [
        { title: 'Соберите экран из документированных элементов', paragraphs: ['Семейство Card подходит для метрик и групп настроек, Input и Select — для фильтров, Tabs — для локальной навигации, Dialog — для подробностей. Раскладка продукта и модель данных остаются в вашем приложении.', 'Полный пример дашборда показывает составной экран с вымышленными данными. Его исходники опубликованы в GitHub. Переносимое ядро — это перечисленные в API компоненты; готовый дашборд не является отдельным экспортом пакета.'] },
        { title: 'Добавьте графики по задаче экрана', paragraphs: ['Формы GlassBar, GlassDot и GlassSector работают с Recharts 3. У адаптивного графика должна быть ненулевая высота, а Tooltip cursor={false} сохраняет подсветку на самом элементе графика.', 'В стартовом проекте уже есть график, локальные заметки и чек-лист. Это запускаемое приложение с фиксированными зависимостями и опубликованным архивом tenvell.'] },
        { title: 'Задайте поведение продукта явно', paragraphs: ['UI kit предоставляет элементы и оформление. Подключите фильтры, сохранение, загрузку и доступ к данным в соответствии с задачами приложения. Демонстрации хранят изменения локально и не предоставляют боевой API или базу данных.'] },
      ],
      fitTitle: 'Подойдёт, если', fit: ['Вы собираете дашборд продукта, настройки или внутренний инструмент на React 19.', 'Карточки, элементы управления и всплывающие слои должны использовать спокойный стеклянный материал.', 'Раскладка, данные и исходники должны оставаться под вашим контролем.'],
      scopeTitle: 'Границы переносимого API', scope: ['Calendar, DataTable и toast из витрины не являются экспортами ядра.', 'Полные дашборд, мессенджер и доска задач доступны как исходники демонстраций.', 'Recharts подключается отдельно по необходимости; ядро работает и без него.'],
      questions: [
        { question: 'Это готовый фреймворк для админки?', answer: 'Tenvell — UI kit. Маршрутизацию, авторизацию, хранение данных и бизнес-процессы задаёт приложение.' },
        { question: 'Можно ли начать с работающего приложения?', answer: 'Да. Архив стартового проекта содержит пакет, lockfile и редактируемый экран. В инструкции описаны запуск npm ci и npm run dev.' },
      ],
      links: [{ href: '/examples/dashboard', label: 'Открыть живой дашборд' }, { href: '/docs/recipes.md', label: 'Примеры формы и графика' }, { href: 'https://github.com/raven-ai-esh/tenvell/tree/main/src/examples', label: 'Исходники полных экранов' }],
    },
  },
  'shadcn-glass-components': {
    preview: 'button', code: 'registry',
    en: {
      lead: 'Use the shadcn CLI to copy tenvell glass components into a React 19 project. You get editable source, scoped CSS and the original Lamina fonts. Start with a small working example or install the complete core when the screen needs several component families.',
      sections: [
        { title: 'Add one example or the complete core', paragraphs: ['The button-demo registry item installs a working button example and its real button/provider dependency. The complete tenvell item installs the public core barrel, so multiple component families can be imported from one module.', 'Individual items have their own import paths. For button.json, import Button, Input, Textarea and TenvellProvider from your components/tenvell/button module. Import the shared stylesheet once.'] },
        { title: 'Find components through an agent', paragraphs: ['Map @tenvell to the registry URL template in the existing components.json. The official shadcn MCP server can then list and search the configured registry, inspect examples and return the add command.', 'The registry exposes the actual component source and its dependencies. The compact component inventory and Markdown API reference provide another way for an agent to inspect the available surface.'] },
        { title: 'Keep the source in your project', paragraphs: ['The CLI writes under the configured components alias. Preserve the project aliases and review any prompts about existing files. The tenvell stylesheet stays scoped to its provider and overlays; keep the MIT and font licence notices with distributed copies.'] },
      ],
      fitTitle: 'A useful fit when', fit: ['Your React 19 project already has a working shadcn configuration.', 'You want editable glass buttons, cards, fields, menus and dialogs.', 'You want to inspect the source and keep its styling in your application.'],
      scopeTitle: 'Before installing', scope: ['Tenvell itself uses ordinary CSS. Keep the host project’s Tailwind configuration if other components need it.', 'An individual item does not create the full core barrel; use its own module path.', 'The official MCP server runs in the consumer’s project context and reads its components.json.'],
      questions: [
        { question: 'Do I need a custom MCP server for tenvell?', answer: 'The existing registry works with the official shadcn MCP server. Configure @tenvell in the target project and follow the client setup guide.' },
        { question: 'Can I install a package instead of copying source?', answer: 'Yes. The installation page also provides the published HTTPS tarball and the locked starter.' },
      ],
      links: [{ href: '/r/registry.json', label: 'Browse the registry index' }, { href: '/docs/registry.md', label: 'Read imports and MCP setup' }, { href: 'https://ui.shadcn.com/docs/mcp', label: 'Official shadcn MCP guide' }],
    },
    ru: {
      lead: 'Shadcn CLI копирует стеклянные компоненты tenvell в проект на React 19. Вы получаете редактируемые исходники, стили в своей области и оригинальные шрифты Lamina. Начните с небольшого рабочего примера или установите ядро, если экрану нужны разные семейства компонентов.',
      sections: [
        { title: 'Один пример или всё ядро', paragraphs: ['Элемент button-demo устанавливает рабочий пример кнопки и её настоящую зависимость с кнопкой и провайдером. Элемент tenvell устанавливает публичный модуль ядра: из него можно импортировать несколько семейств компонентов.', 'У отдельных элементов собственные пути импорта. После button.json импортируйте Button, Input, Textarea и TenvellProvider из своего модуля components/tenvell/button. Общий файл стилей подключается один раз.'] },
        { title: 'Поиск компонентов через агента', paragraphs: ['Добавьте шаблон URL для @tenvell в существующий components.json. Официальный shadcn MCP сможет перечислить и найти элементы registry, показать примеры и вернуть команду установки.', 'Registry публикует настоящий код компонентов и их зависимости. Для просмотра возможностей агент также может использовать компактный список компонентов и Markdown-справочник API.'] },
        { title: 'Исходники остаются в вашем проекте', paragraphs: ['CLI записывает файлы в настроенный алиас компонентов. Сохраните алиасы проекта и проверьте запросы о замене существующих файлов. Стили tenvell ограничены провайдером и его слоями; при распространении копий сохраняйте лицензии кода и шрифтов.'] },
      ],
      fitTitle: 'Подойдёт, если', fit: ['В проекте на React 19 уже настроен shadcn.', 'Нужны редактируемые стеклянные кнопки, карточки, поля, меню и диалоги.', 'Вы хотите читать исходники и менять оформление внутри приложения.'],
      scopeTitle: 'Перед установкой', scope: ['Сам tenvell использует обычный CSS. Если другим элементам проекта нужен Tailwind, сохраните его настройки.', 'Отдельный элемент не создаёт общий модуль ядра: используйте его собственный путь импорта.', 'Официальный MCP запускается в контексте проекта пользователя и читает его components.json.'],
      questions: [
        { question: 'Нужен ли отдельный MCP-сервер для tenvell?', answer: 'Registry работает с официальным shadcn MCP. Добавьте @tenvell в целевой проект и настройте клиент по официальной инструкции.' },
        { question: 'Можно ли установить пакет без копирования исходников?', answer: 'Да. На странице установки также доступны опубликованный HTTPS-архив пакета и стартовый проект с lockfile.' },
      ],
      links: [{ href: '/r/registry.json', label: 'Открыть список registry' }, { href: '/docs/registry.md', label: 'Пути импорта и настройка MCP' }, { href: 'https://ui.shadcn.com/docs/mcp', label: 'Официальная инструкция shadcn MCP' }],
    },
  },
  'choosing-a-react-ui-kit': {
    preview: null, code: null,
    en: {
      lead: 'Start with the product constraints: React compatibility, the visual language you want, the controls you need and how much of the implementation you want to own. A useful shortlist separates a styled UI kit from an unstyled behavior library or a complete application framework.',
      sections: [
        { title: 'Match the visual language to the product', paragraphs: ['Tenvell is a focused option for React 19 interfaces built around thin glass, local typography and restrained interaction. It is a good candidate for cards, settings, forms and dashboard controls when that material fits the brief.', 'If the brief requires Material Design, a broad source-first ecosystem or primitives to style from scratch, examine the corresponding approach below. The table describes roles; it does not rank quality or claim one library wins every project.'] },
        { title: 'Check the scope you actually need', paragraphs: ['List the controls on your next real screen, then verify their exports and behavior in the candidate’s own documentation. A showcase can contain application-specific examples that are not package exports.', 'For tenvell, Calendar, DataTable, toast and the complete product demonstrations live in the website source. The portable core, optional Recharts shapes and individual registry items are documented separately.'] },
        { title: 'Try a small product flow', paragraphs: ['Build a labelled form or dialog in your existing application. Check keyboard navigation, focus, the chosen theme, reduced motion and contrast on the real backdrop. Run the application’s own build before expanding the integration.', 'Tenvell provides a starter, a runnable button example and documented form/chart recipes for this evaluation. Choose another approach when its component scope or platform compatibility better matches the product.'] },
      ],
      fitTitle: 'Shortlist tenvell for', fit: ['React 19 applications with modern browser support.', 'A consistent thin-glass style across controls, cards and overlays.', 'Editable shadcn source or a scoped ESM package with local Lamina fonts.'],
      scopeTitle: 'Use concrete selection criteria', scope: ['Verify framework and browser requirements before changing the project stack.', 'Compare actual exported controls and the effort to adapt their styling.', 'Treat screenshots and demonstrations as examples; validate the product flow you will ship.'],
      questions: [
        { question: 'Which React UI kit is best?', answer: 'The useful choice depends on the visual brief, component scope and project constraints. Tenvell is a focused candidate for thin-glass React 19 interfaces, with a documented API and editable source.' },
        { question: 'Can an agent evaluate the kit?', answer: 'Give it the llms.txt map and the task requirements. The map links to compatibility, exact API types, installation commands and working recipes.' },
      ],
      comparison: [
        { name: 'tenvell', role: 'Thin-glass styled UI kit for React 19.', choose: 'A shared glass material, scoped CSS and editable component source fit the product.', href: '/docs/overview.md' },
        { name: 'shadcn/ui', role: 'Source-first React components and a registry ecosystem.', choose: 'You want to compose and own components in an existing shadcn workflow.', href: 'https://ui.shadcn.com/docs' },
        { name: 'Material UI', role: 'React components implementing Material Design, with theming and customization.', choose: 'The product calls for the Material design language and its component system.', href: 'https://mui.com/material-ui/getting-started/' },
        { name: 'React Aria', role: 'Unstyled React components with interaction and accessibility behavior.', choose: 'You want to supply the visual design and styling yourself.', href: 'https://react-aria.adobe.com/' },
      ],
      links: [{ href: '/docs/api.md', label: 'Inspect tenvell’s public API' }, { href: '/docs/recipes.md', label: 'Try a small working flow' }, { href: '/agents', label: 'Use the agent integration guide' }],
    },
    ru: {
      lead: 'Начните с ограничений продукта: совместимости с React, нужного визуального языка, набора элементов и того, какую часть реализации вы хотите контролировать. При выборе полезно различать готовый стиль, библиотеку поведения без оформления и полноценный каркас приложения.',
      sections: [
        { title: 'Сопоставьте стиль с задачей продукта', paragraphs: ['Tenvell — специализированный вариант для React 19 с тонким стеклом, локальной типографикой и сдержанным откликом. Его стоит рассмотреть для карточек, настроек, форм и элементов дашборда, если такой материал соответствует задаче.', 'Если нужен Material Design, большая экосистема копируемых компонентов или элементы для оформления с нуля, изучите соответствующий подход ниже. Таблица описывает назначение вариантов, без универсального рейтинга качества.'] },
        { title: 'Проверьте необходимый набор возможностей', paragraphs: ['Перечислите элементы ближайшего реального экрана и проверьте их экспорты и поведение в документации каждого кандидата. Витрина может включать примеры приложения, которых нет в API пакета.', 'В tenvell Calendar, DataTable, toast и полные демонстрационные экраны находятся в исходниках сайта. Переносимое ядро, отдельные формы для Recharts и элементы registry описаны отдельно.'] },
        { title: 'Соберите небольшой сценарий продукта', paragraphs: ['Добавьте форму с подписями полей или диалог в своё приложение. Проверьте клавиатуру, фокус, выбранную тему, уменьшенное движение и контраст на реальном фоне. Перед расширением интеграции выполните сборку приложения.', 'Для такой оценки в tenvell есть стартовый проект, рабочая кнопка и примеры формы и графика. Выбирайте другой подход, если его набор компонентов или совместимость лучше соответствует продукту.'] },
      ],
      fitTitle: 'Рассмотрите tenvell для', fit: ['Приложений на React 19 с поддержкой современных браузеров.', 'Единого стиля тонкого стекла в элементах управления, карточках и слоях.', 'Редактируемых исходников через shadcn или ESM-пакета со стилями в своей области и локальными шрифтами.'],
      scopeTitle: 'Сравнивайте по конкретным требованиям', scope: ['Проверьте требования к фреймворку и браузерам до изменения стека проекта.', 'Сопоставьте реальные экспорты и объём работы по адаптации оформления.', 'Оцените тот сценарий, который будет работать в продукте, вместе с примерами и скриншотами.'],
      questions: [
        { question: 'Какой UI kit для React лучше?', answer: 'Выбор зависит от визуальной задачи, набора компонентов и ограничений проекта. Tenvell стоит рассмотреть для тонких стеклянных интерфейсов на React 19: у него документированный API и редактируемые исходники.' },
        { question: 'Может ли агент оценить дизайн-кит?', answer: 'Передайте ему llms.txt и требования к экрану. Карта ведёт к совместимости, точным типам API, командам установки и рабочим примерам.' },
      ],
      comparison: [
        { name: 'tenvell', role: 'Готовый стеклянный UI kit для React 19.', choose: 'Продукту подходят общий стеклянный материал, стили в своей области и редактируемые исходники.', href: '/docs/overview.md' },
        { name: 'shadcn/ui', role: 'Копируемые React-компоненты и экосистема registry.', choose: 'Нужно собирать интерфейс и владеть кодом компонентов в процессе shadcn.', href: 'https://ui.shadcn.com/docs' },
        { name: 'Material UI', role: 'React-компоненты в Material Design с настройкой тем и оформления.', choose: 'Продукту нужны визуальный язык Material и его система компонентов.', href: 'https://mui.com/material-ui/getting-started/' },
        { name: 'React Aria', role: 'React-компоненты без стилей с поведением взаимодействия и доступности.', choose: 'Нужно самостоятельно задать визуальный язык и оформление.', href: 'https://react-aria.adobe.com/' },
      ],
      links: [{ href: '/docs/api.md', label: 'Проверить API tenvell' }, { href: '/docs/recipes.md', label: 'Попробовать рабочий сценарий' }, { href: '/agents', label: 'Инструкция для агента' }],
    },
  },
};

export function guideCode(kind, site) {
  if (kind === 'registry') return `npx shadcn@4.23.0 add ${site}/r/button-demo.json`;
  if (kind === 'dashboard') return `import { TenvellProvider, Card, CardHeader, CardTitle, CardContent } from 'tenvell';\nimport 'tenvell/styles.css';\n\nexport default function DashboardCard() {\n  return (\n    <TenvellProvider theme="light" surface="air">\n      <Card>\n        <CardHeader><CardTitle>Active projects</CardTitle></CardHeader>\n        <CardContent><p>12</p><small>Local example data</small></CardContent>\n      </Card>\n    </TenvellProvider>\n  );\n}`;
  if (kind === 'provider') return `import { TenvellProvider, Card, Button } from 'tenvell';\nimport 'tenvell/styles.css';\n\nexport default function GlassCard() {\n  return (\n    <TenvellProvider theme="light" surface="frost">\n      <Card><p>Your interface, one material.</p><Button>Continue</Button></Card>\n    </TenvellProvider>\n  );\n}`;
  return '';
}

export const guideLabels = {
  en: { guides: 'Build with tenvell', back: 'Back to catalog', install: 'Install tenvell', markdown: 'Read as Markdown', example: 'A working component', snippet: 'Start in your project', questions: 'Common questions', related: 'Explore by task', comparison: 'Different approaches to a React UI kit', option: 'Option', role: 'What it provides', choose: 'When to consider it', reference: 'Read the reference', prompt: 'Give your agent a starting point', catalog: 'Explore the catalog' },
  ru: { guides: 'Собирайте с tenvell', back: 'К каталогу', install: 'Установить tenvell', markdown: 'Прочитать в Markdown', example: 'Рабочий компонент', snippet: 'Начните в своём проекте', questions: 'Частые вопросы', related: 'Выберите задачу', comparison: 'Разные подходы к UI kit для React', option: 'Вариант', role: 'Что предоставляет', choose: 'Когда рассмотреть', reference: 'Открыть справочник', prompt: 'Дайте агенту точку входа', catalog: 'Открыть каталог' },
};
