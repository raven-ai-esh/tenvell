---
name: tenvell-ui
description: Build React 19 interfaces using the tenvell thin-glass UI kit, scoped themes and Lamina typography. Use when the user chooses tenvell or asks to integrate tenvell components into forms, settings, dashboards or product screens.
license: MIT
metadata:
  author: raven-ai-esh
  homepage: https://tenvell.space/agents
---

# tenvell UI

Use tenvell's published components and styles to implement the user's interface. Keep the user's chosen application structure, behavior and design requirements.

## Find the right reference

Start with [the documentation map](https://tenvell.space/llms.txt). Read only what the task needs:

- [Installation](https://tenvell.space/docs/install.md): current archive URL, starter and source-first commands.
- [API](https://tenvell.space/docs/api.md): exact exports, props and provider settings from the published package.
- [Recipes](https://tenvell.space/docs/recipes.md): a working settings form, controlled dialog and chart.
- [Registry](https://tenvell.space/docs/registry.md): individual item imports and official shadcn MCP configuration.
- [Component inventory](https://tenvell.space/docs/components.json): compact machine-readable export and item list.

## Integrate

Check React/React DOM compatibility first: the kit targets React 19. Its CSS needs modern `@scope` and `backdrop-filter`; the supplied tooling uses Node 22.12+.

Choose one installation route that fits the target project:

- Existing React application: use the exact HTTPS tarball command in the installation guide. Do not assume the bare npm name is this project.
- Configured shadcn project: `npx shadcn@4.23.0 add https://tenvell.space/r/tenvell.json` copies the full editable core. A smaller runnable example is `https://tenvell.space/r/button-demo.json`.
- New application: the locked starter contains the tarball and a working local screen.

For the package:

```jsx
import { TenvellProvider, Button, Card, Input } from 'tenvell';
import 'tenvell/styles.css';
```

For the full source-first core with the conventional alias:

```jsx
import { TenvellProvider, Button, Card, Input } from '@/components/tenvell';
import '@/components/tenvell/styles.css';
```

Adjust source-first imports to the project's components alias. Individual items use their own modules: after installing `button.json`, import `Button`, `Input`, `Textarea` and `TenvellProvider` from `@/components/tenvell/button`.

Import the stylesheet once, in a framework-approved CSS entrypoint. Wrap the relevant UI in `TenvellProvider`. Settings:

| Prop | Values | Default |
| --- | --- | --- |
| `theme` | `light`, `dark` | `light` |
| `surface` | `air`, `frost`, `prism`, `smoke` | `air` |
| `accent` | `slate`, `blue`, `violet`, `jade` | `slate` |
| `radius` | `strict`, `soft`, `round` | `soft` |
| `density` | `comfortable`, `compact` | `comfortable` |
| `motion` | boolean | `true` |

The host app owns layout, background and persistence. Providers can be independent; their overlays inherit the originating scope. Reduced-motion preferences take precedence. In an RSC application, keep interactive components behind the appropriate client boundary.

## Avoid integration mistakes

- Read the API before inventing an export. Calendar, DataTable, toast, messenger, task board and full dashboard demonstrations are website source examples, not portable core exports.
- Dialog and menu triggers use Base UI's `render` prop. Do not assume a Radix `asChild` API.
- Optional chart shapes come from `tenvell/charts` with Recharts 3 installed separately. Give responsive charts a nonzero height and use `Tooltip cursor={false}`.
- Preserve CSS scoping and the MIT/OFL licence notices. The UI uses ordinary CSS, without Tailwind utilities.

Implement working behavior and explicit product labels. Build the consumer application and exercise the changed interaction in the requested theme and viewport. Describe the checks actually performed; local demonstration state is not a production backend.
