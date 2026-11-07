# Glassmorphism UI kit for React.

> Build React 19 interfaces with thin-glass cards, forms and dialogs. Four glass surfaces, scoped CSS, local Lamina fonts and MIT-licensed source.

Tenvell gives glassmorphism a consistent set of React components: thin edges, translucent surfaces, readable controls and a quiet hover-to-press response. The same material runs through cards, fields, menus and dialogs.

## One material across your interface

Use air, frost, prism or smoke surfaces in light or dark themes. TenvellProvider keeps the settings in one scope, including its portalled dialogs and menus. Several providers can coexist on the same page.

Lamina UI and Lamina Mono are included locally. The component CSS is ordinary CSS with native scope boundaries; you can use it alongside the rest of your application without adopting a utility-class design system.

## Start with a real control

The button below is the same source-first example offered by the registry. It includes a provider, local styles, click feedback and an independent light/dark setting. The API reference lists the exact props and exports of the current package.

## Choose the surface for the content

Start with a restrained surface and check text and control contrast against the actual backdrop of your screen. Keep the application background and layout outside the provider. Tenvell supplies the UI material; the application supplies its content and behavior.

## A useful fit when

- Your application uses React and React DOM 19.
- You want a thin-glass visual language for forms, cards and product controls.
- You want editable source or an ESM package with scoped styles and local fonts.

## Check before choosing

- The CSS requires modern @scope and backdrop-filter support.
- The kit does not include optical lens simulation or a native mobile rendering layer.
- Check the actual product flow for contrast, keyboard behavior and assistive-technology needs.

## Start in your project

```sh
npm install https://tenvell.space/releases/0.2.1/tenvell-0.2.1.tgz
```

```jsx
import { TenvellProvider, Card, Button } from 'tenvell';
import 'tenvell/styles.css';

export default function GlassCard() {
  return (
    <TenvellProvider theme="light" surface="frost">
      <Card><p>Your interface, one material.</p><Button>Continue</Button></Card>
    </TenvellProvider>
  );
}
```

## Common questions

### Does tenvell require Tailwind?

No. Its components use ordinary CSS. Source-first installation uses the shadcn CLI as a distribution tool.

### Can different areas use different themes?

Yes. Each TenvellProvider owns its theme, surface, accent, radius, density and motion settings.

### How is the kit licensed?

Own code is MIT licensed. The original Lamina fonts use SIL OFL 1.1; keep the bundled notices when distributing copies.

## Read the reference

- [Explore live cards and surfaces](https://tenvell.space/#cards)
- [Read the published API](https://tenvell.space/docs/api.md)
- [See the Lamina typefaces](https://tenvell.space/typeface.html)

- [llms.txt](https://tenvell.space/llms.txt)

- [Install tenvell](https://tenvell.space/install)

HTML: https://tenvell.space/react-glassmorphism-ui-kit
