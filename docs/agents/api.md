# tenvell {{VERSION}} API

The declarations below are extracted from the published package archive. They describe the installed release, including exact export names and component props.

## Provider

`TenvellProvider` renders a scoped wrapper. Import `tenvell/styles.css` once; the provider does not set the host page's layout or background and does not persist application preferences.

| Prop | Values | Default |
| --- | --- | --- |
| `theme` | `light`, `dark` | `light` |
| `surface` | `air`, `frost`, `prism`, `smoke` | `air` |
| `accent` | `slate`, `blue`, `violet`, `jade` | `slate` |
| `radius` | `strict`, `soft`, `round` | `soft` |
| `density` | `comfortable`, `compact` | `comfortable` |
| `motion` | boolean | `true` |

Multiple independent providers are supported. Dialogs and menus inherit their originating provider's theme through a body portal. CSS custom properties passed in the provider's `style` also reach its overlays; layout styles stay on the wrapper. `--tenvell-overlay-z` sets the overlay layer (default `1000`). Reduced-motion preferences take precedence.

Pass product labels and accessible names explicitly. The portable core renders caller-provided content; the website's EN/RU translation layer is not part of the package.

## Export boundaries

- `tenvell`: the core exports shown below.
- `tenvell/styles.css`: scoped styles and locally embedded Lamina fonts.
- `tenvell/charts`: optional Recharts shapes, with Recharts 3 installed separately.
- Website-only examples include Calendar, DataTable, toast, the messenger, task board and complete product screens. Do not import these names from the core package.

After a source-first installation, substitute the corresponding `@/components/tenvell` module paths. The compact [component inventory]({{SITE}}/docs/components.json) records the exports of each registry item.
