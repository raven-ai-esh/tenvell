export const agentResources = [
  { path: '/llms.txt', label: 'llms.txt', description: 'Краткая карта документации для первого запроса.' },
  { path: '/llms-full.txt', label: 'llms-full.txt', description: 'Весь справочник одним текстовым файлом.' },
  { path: '/docs/install.md', label: 'Установка', description: 'Архив пакета, исходники через shadcn и стартовый проект.' },
  { path: '/docs/api.md', label: 'API и настройки', description: 'Точные экспорты и типы опубликованного пакета.' },
  { path: '/docs/registry.md', label: 'Registry и MCP', description: 'Компоненты, пути импорта и подключение @tenvell.' },
  { path: '/docs/recipes.md', label: 'Рабочие примеры', description: 'Форма настроек, диалог и график с локальным состоянием.' },
  { path: '/docs/components.json', label: 'components.json', description: 'Машиночитаемый список экспортов и элементов registry.' },
  { path: '/AGENTS.md', label: 'AGENTS.md', description: 'Порядок интеграции и границы возможностей библиотеки.' },
];

export function agentPrompt(site) {
  return `Read ${site}/llms.txt. Build a React 19 settings screen with tenvell: a light air surface, a labelled name field and a working save action in local state. Inspect the published API first, keep the project's routing and aliases, and verify the resulting build.`;
}
