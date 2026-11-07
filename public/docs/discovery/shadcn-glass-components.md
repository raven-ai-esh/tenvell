# Glass components for shadcn projects.

> Add editable React glass components with the shadcn CLI. Start with one button or the complete tenvell UI kit, with scoped CSS and original local fonts.

Use the shadcn CLI to copy tenvell glass components into a React 19 project. You get editable source, scoped CSS and the original Lamina fonts. Start with a small working example or install the complete core when the screen needs several component families.

## Add one example or the complete core

The button-demo registry item installs a working button example and its real button/provider dependency. The complete tenvell item installs the public core barrel, so multiple component families can be imported from one module.

Individual items have their own import paths. For button.json, import Button, Input, Textarea and TenvellProvider from your components/tenvell/button module. Import the shared stylesheet once.

## Find components through an agent

Map @tenvell to the registry URL template in the existing components.json. The official shadcn MCP server can then list and search the configured registry, inspect examples and return the add command.

The registry exposes the actual component source and its dependencies. The compact component inventory and Markdown API reference provide another way for an agent to inspect the available surface.

## Keep the source in your project

The CLI writes under the configured components alias. Preserve the project aliases and review any prompts about existing files. The tenvell stylesheet stays scoped to its provider and overlays; keep the MIT and font licence notices with distributed copies.

## A useful fit when

- Your React 19 project already has a working shadcn configuration.
- You want editable glass buttons, cards, fields, menus and dialogs.
- You want to inspect the source and keep its styling in your application.

## Before installing

- Tenvell itself uses ordinary CSS. Keep the host project’s Tailwind configuration if other components need it.
- An individual item does not create the full core barrel; use its own module path.
- The official MCP server runs in the consumer’s project context and reads its components.json.

## Start in your project

```sh
npx shadcn@4.23.0 add https://tenvell.space/r/button-demo.json
```

## Common questions

### Do I need a custom MCP server for tenvell?

The existing registry works with the official shadcn MCP server. Configure @tenvell in the target project and follow the client setup guide.

### Can I install a package instead of copying source?

Yes. The installation page also provides the published HTTPS tarball and the locked starter.

## Read the reference

- [Browse the registry index](https://tenvell.space/r/registry.json)
- [Read imports and MCP setup](https://tenvell.space/docs/registry.md)
- [Official shadcn MCP guide](https://ui.shadcn.com/docs/mcp)

- [llms.txt](https://tenvell.space/llms.txt)

- [Install tenvell](https://tenvell.space/install)

HTML: https://tenvell.space/shadcn-glass-components
