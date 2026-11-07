import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const descriptions = {
  tenvell: 'A complete React 19 UI kit for glassmorphism dashboards, settings and forms. Scoped CSS, original local fonts, cards, fields, menus and dialogs.',
  provider: 'Independent light and dark themes, four glass surfaces, accents, radius, density and motion settings for a React UI scope and its overlays.',
  button: 'React buttons, text inputs and textareas for forms and product actions, with thin-glass styling and loading or disabled states.',
  checkbox: 'A thin-glass React checkbox for settings and forms, including checked, unchecked and indeterminate states.',
  switch: 'A thin-glass React switch for on/off preferences and settings panels.',
  card: 'Composable thin-glass React cards for dashboard metrics, profile panels and grouped settings, with header, content and footer parts.',
  glass: 'Four glassmorphism surface finishes and a material picker for React interfaces, with light and dark themes and scoped styling.',
  select: 'A themed React select control for form fields and dashboard filters, with a provider-scoped popup.',
  menu: 'React dropdown menus for product actions and settings, with themed portalled content and selection items.',
  dialog: 'React modal dialogs with thin-glass styling, accessible titles and descriptions, and the originating provider’s theme.',
  primitives: 'React identity, selection, navigation and feedback controls, including badges, avatars, progress, radio groups and pagination.',
  disclosure: 'React tabs, accordion, popover, tooltip, side sheet and combobox components for navigation, details and product forms.',
  charts: 'Optional Recharts 3 shapes for glass bars, dots and sectors in React dashboards. Item highlighting follows the actual chart element.',
};
const indexPath = path.join(root, 'public/r/registry.json');
const registry = JSON.parse(await readFile(indexPath, 'utf8'));
for (const item of registry.items) {
  if (!descriptions[item.name]) continue;
  item.description = descriptions[item.name];
  const file = path.join(root, 'public/r', item.name + '.json');
  const published = JSON.parse(await readFile(file, 'utf8'));
  published.description = item.description;
  await writeFile(file, JSON.stringify(published, null, 2) + '\n');
}
await writeFile(indexPath, JSON.stringify(registry, null, 2) + '\n');
console.log('Prepared semantic registry descriptions; component source and immutable archives are unchanged.');
