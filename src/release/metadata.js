import { discoveryDocuments } from '../discovery/routes.js';

export const publicDocuments = [
  { path: '/', markdown: '/index.md', title: 'tenvell — React UI kit with thin-glass components', titleRu: 'tenvell — стеклянный дизайн-кит для React', description: 'An open-source React 19 UI kit for glassmorphism interfaces, dashboards and settings. Editable shadcn components, scoped CSS and original local Lamina fonts.', descriptionRu: 'Открытый UI kit для React 19: тонкое стекло для форм, дашбордов и настроек. Редактируемые компоненты через shadcn, стили в своей области и локальные шрифты Lamina.' },
  { path: '/install', markdown: '/install.md', title: 'Install tenvell — React UI kit and shadcn registry', description: 'Install tenvell in a React 19 project from the official package archive, editable shadcn registry or locked starter. Scoped CSS, local fonts and MIT code.', descriptionRu: 'Установка tenvell в React 19: архив пакета, редактируемые компоненты через shadcn и готовый стартовый проект. Стили в своей области, локальные шрифты и код MIT.' },
  { path: '/agents', markdown: '/AGENTS.md', title: 'tenvell for AI agents — Skill, API reference and MCP', description: 'Use tenvell with a coding agent: llms.txt, a portable UI skill, exact component APIs, working React recipes and the official shadcn MCP registry integration.', descriptionRu: 'Tenvell для AI-агентов: llms.txt, переносимый skill, точный API компонентов, рабочие примеры React и подключение registry через официальный shadcn MCP.' },
  ...discoveryDocuments,
];

export const documentMetadata = pathname => publicDocuments.find(document => document.path === pathname.replace(/\.html$/, '')) || publicDocuments[0];
