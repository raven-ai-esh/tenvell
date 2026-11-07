# tenvell registry and MCP

The [public registry index]({{SITE}}/r/registry.json) lists installable source items. Item URLs return the shadcn registry format, including editable source and dependencies; no authentication is required.

## Namespace

Merge this field into the existing `components.json` in a configured React 19/shadcn project. Preserve the project's other settings and aliases.

```json
{
  "registries": {
    "@tenvell": "{{SITE}}/r/{name}.json"
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
