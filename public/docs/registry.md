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
| [tenvell](https://tenvell.space/r/tenvell.json) | Complete core with scoped thin-glass styling. | `@/components/tenvell` |
| [provider](https://tenvell.space/r/provider.json) | Scoped themes and motion with scoped thin-glass styling. | `@/components/tenvell/provider` |
| [button](https://tenvell.space/r/button.json) | Buttons, input and textarea with scoped thin-glass styling. | `@/components/tenvell/button` |
| [checkbox](https://tenvell.space/r/checkbox.json) | Checkbox with scoped thin-glass styling. | `@/components/tenvell/checkbox` |
| [switch](https://tenvell.space/r/switch.json) | Switch with scoped thin-glass styling. | `@/components/tenvell/switch` |
| [card](https://tenvell.space/r/card.json) | Card family with scoped thin-glass styling. | `@/components/tenvell/card` |
| [glass](https://tenvell.space/r/glass.json) | Glass surfaces with scoped thin-glass styling. | `@/components/tenvell/glass` |
| [select](https://tenvell.space/r/select.json) | Select with scoped thin-glass styling. | `@/components/tenvell/select` |
| [menu](https://tenvell.space/r/menu.json) | Dropdown menu with scoped thin-glass styling. | `@/components/tenvell/menu` |
| [dialog](https://tenvell.space/r/dialog.json) | Dialog with scoped thin-glass styling. | `@/components/tenvell/dialog` |
| [primitives](https://tenvell.space/r/primitives.json) | Selection, identity and feedback primitives with scoped thin-glass styling. | `@/components/tenvell/primitives` |
| [disclosure](https://tenvell.space/r/disclosure.json) | Tabs, accordion, popover, sheet and combobox with scoped thin-glass styling. | `@/components/tenvell/disclosure` |
| [charts](https://tenvell.space/r/charts.json) | Actual-element Recharts shapes with scoped thin-glass styling. | `@/components/tenvell/charts` |
| [button-demo](https://tenvell.space/r/button-demo.json) | A runnable button example with its provider, scoped styles, click feedback and light/dark toggle. | `@/components/tenvell/examples/button-demo` |

A source item includes its provider dependency and scoped CSS. Installing several overlapping items may prompt the CLI about existing files; review changes in the target project. The complete core is usually the simplest option when several component families are needed.
