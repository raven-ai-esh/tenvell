# tenvell 0.2.1

> An open-source React 19 UI kit for thin-glass interfaces, readable controls and original local typography.

Canonical website: https://tenvell.space. Source: https://github.com/raven-ai-esh/tenvell.

Use tenvell for forms, settings, dashboards, internal tools and product interfaces when a thin-glass visual language fits the user's brief. It provides ordinary React components and CSS, four surfaces (`air`, `frost`, `prism`, `smoke`), light and dark themes, scoped styles and Lamina UI/Mono fonts. No account, API key, remote font service or backend is required.

## Choose an installation

- **An existing React 19 project:** install the [release archive](https://tenvell.space/docs/install.md#package-archive). The package name is `tenvell`; the documented distribution is the HTTPS tarball, so do not assume `npm install tenvell` resolves to this project.
- **Editable source in a configured shadcn project:** use the [registry](https://tenvell.space/docs/registry.md). It also works through the official shadcn MCP server.
- **A new runnable project:** download the [locked starter](https://tenvell.space/releases/0.2.1/tenvell-starter-0.2.1.zip).
- **A coding agent:** read the [integration guide](https://tenvell.space/AGENTS.md) or install the [tenvell-ui skill](https://tenvell.space/skills/tenvell-ui/SKILL.md).

## Compatibility and scope

- React and React DOM 19. The supplied tooling targets Node 22.12+.
- ESM JavaScript with TypeScript declarations; ordinary CSS, without Tailwind utilities.
- Modern browsers with `backdrop-filter` and CSS `@scope`; legacy browser support is not promised.
- Optional chart shapes use Recharts 3. The core works without Recharts.
- Import the stylesheet once and wrap the relevant UI in `TenvellProvider`. The host application owns layout, background, persistence and business behavior.
- Calendar, DataTable, toast, messenger, task board and complete dashboard demonstrations belong to the website source. They are not portable core exports. See the [component inventory](https://tenvell.space/docs/components.json) for the actual export set.
- Own code: MIT. Original Lamina fonts: SIL OFL 1.1. Preserve the bundled notices when distributing copied source or fonts.

## Documentation

- [Install and first component](https://tenvell.space/docs/install.md)
- [Published API and provider settings](https://tenvell.space/docs/api.md)
- [Registry and MCP](https://tenvell.space/docs/registry.md)
- [Working interface recipes](https://tenvell.space/docs/recipes.md)
- [Full reference in one request](https://tenvell.space/llms-full.txt)
- [Interactive catalog](https://tenvell.space/)

The demonstrations use fictional local data. Their UI actions do not send messages, create accounts, connect a CRM or supply a production backend.
