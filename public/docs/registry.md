# tenvell registry and MCP

The [public registry index](https://tenvell.space/r/registry.json) lists installable source items. Item URLs return the shadcn registry format, including editable source and dependencies; no authentication is required.

## Namespace

Merge this field into the existing `components.json` in a configured React 19/shadcn project. Preserve the project's other settings and aliases.

```json
{
  "registries": {
    "@tenvell": "https://tenvell.space/r/{name}.json"
  }
}
```

Then install the complete core or a smaller working example:

```sh
npx shadcn@4.23.0 add @tenvell/tenvell
npx shadcn@4.23.0 add @tenvell/button-demo
```

Either command is an alternative starting point; running both is unnecessary. Without a namespace mapping, use the full item URL from the table below.

## Official shadcn MCP server

The [official shadcn MCP server](https://ui.shadcn.com/docs/mcp) reads your project's registry configuration and supports listing, searching, viewing and installing compatible registry items. In clients using the common `mcpServers` configuration shape, the server entry is:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@4.23.0", "mcp"]
    }
  }
}
```

Client configuration locations differ; use the official guide for your client. Run the server in the context of the target project so it can read `components.json`. Installing this configuration is a user choice; reading this website does not modify the client's settings.

With `@tenvell` configured, an example request is:

> Find the button, card and dialog components in the @tenvell registry, inspect their APIs, and build a React 19 settings form with a light air surface. Keep the existing application routing and connect the save action to local form state.

Tenvell provides the static registry. The MCP process is the official shadcn CLI running in the consumer's environment; the website does not advertise a separate hosted MCP endpoint.

## Items and imports

The following table is generated from the current published registry. `@/components` assumes the conventional project alias; use your configured components alias when it differs. Import `@/components/tenvell/styles.css` once after installing source items.

| Item | Purpose | Import from |
| --- | --- | --- |
| [tenvell](https://tenvell.space/r/tenvell.json) | A complete React 19 UI kit for glassmorphism dashboards, settings and forms. Scoped CSS, original local fonts, cards, fields, menus and dialogs. | `@/components/tenvell` |
| [provider](https://tenvell.space/r/provider.json) | Independent light and dark themes, four glass surfaces, accents, radius, density and motion settings for a React UI scope and its overlays. | `@/components/tenvell/provider` |
| [button](https://tenvell.space/r/button.json) | React buttons, text inputs and textareas for forms and product actions, with thin-glass styling and loading or disabled states. | `@/components/tenvell/button` |
| [checkbox](https://tenvell.space/r/checkbox.json) | A thin-glass React checkbox for settings and forms, including checked, unchecked and indeterminate states. | `@/components/tenvell/checkbox` |
| [switch](https://tenvell.space/r/switch.json) | A thin-glass React switch for on/off preferences and settings panels. | `@/components/tenvell/switch` |
| [card](https://tenvell.space/r/card.json) | Composable thin-glass React cards for dashboard metrics, profile panels and grouped settings, with header, content and footer parts. | `@/components/tenvell/card` |
| [glass](https://tenvell.space/r/glass.json) | Four glassmorphism surface finishes and a material picker for React interfaces, with light and dark themes and scoped styling. | `@/components/tenvell/glass` |
| [select](https://tenvell.space/r/select.json) | A themed React select control for form fields and dashboard filters, with a provider-scoped popup. | `@/components/tenvell/select` |
| [menu](https://tenvell.space/r/menu.json) | React dropdown menus for product actions and settings, with themed portalled content and selection items. | `@/components/tenvell/menu` |
| [dialog](https://tenvell.space/r/dialog.json) | React modal dialogs with thin-glass styling, accessible titles and descriptions, and the originating provider’s theme. | `@/components/tenvell/dialog` |
| [primitives](https://tenvell.space/r/primitives.json) | React identity, selection, navigation and feedback controls, including badges, avatars, progress, radio groups and pagination. | `@/components/tenvell/primitives` |
| [disclosure](https://tenvell.space/r/disclosure.json) | React tabs, accordion, popover, tooltip, side sheet and combobox components for navigation, details and product forms. | `@/components/tenvell/disclosure` |
| [charts](https://tenvell.space/r/charts.json) | Optional Recharts 3 shapes for glass bars, dots and sectors in React dashboards. Item highlighting follows the actual chart element. | `@/components/tenvell/charts` |
| [button-demo](https://tenvell.space/r/button-demo.json) | A runnable button example with its provider, scoped styles, click feedback and light/dark toggle. | `@/components/tenvell/examples/button-demo` |

A source item includes its provider dependency and scoped CSS. Installing several overlapping items may prompt the CLI about existing files; review changes in the target project. The complete core is usually the simplest option when several component families are needed.
