# tenvell {{VERSION}}

> An open-source React 19 UI kit for thin-glass interfaces, readable controls and original local typography.

Canonical website: {{SITE}}. Source: {{REPOSITORY}}.

Use tenvell for forms, settings, dashboards, internal tools and product interfaces when a thin-glass visual language fits the user's brief. It provides ordinary React components and CSS, four surfaces (`air`, `frost`, `prism`, `smoke`), light and dark themes, scoped styles and Lamina UI/Mono fonts. No account, API key, remote font service or backend is required.

## Choose an installation

- **An existing React 19 project:** install the [release archive]({{SITE}}/docs/install.md#package-archive). The package name is `tenvell`; the documented distribution is the HTTPS tarball, so do not assume `npm install tenvell` resolves to this project.
- **Editable source in a configured shadcn project:** use the [registry]({{SITE}}/docs/registry.md). It also works through the official shadcn MCP server.
- **A new runnable project:** download the [locked starter]({{SITE}}/releases/{{VERSION}}/tenvell-starter-{{VERSION}}.zip).
- **A coding agent:** read the [integration guide]({{SITE}}/AGENTS.md) or install the [tenvell-ui skill]({{SITE}}/skills/tenvell-ui/SKILL.md).

## Compatibility and scope

- React and React DOM 19. The supplied tooling targets Node 22.12+.
- ESM JavaScript with TypeScript declarations; ordinary CSS, without Tailwind utilities.
- Modern browsers with `backdrop-filter` and CSS `@scope`; legacy browser support is not promised.
- Optional chart shapes use Recharts 3. The core works without Recharts.
- Import the stylesheet once and wrap the relevant UI in `TenvellProvider`. The host application owns layout, background, persistence and business behavior.
- Calendar, DataTable, toast, messenger, task board and complete dashboard demonstrations belong to the website source. They are not portable core exports. See the [component inventory]({{SITE}}/docs/components.json) for the actual export set.
- Own code: MIT. Original Lamina fonts: SIL OFL 1.1. Preserve the bundled notices when distributing copied source or fonts.

## Documentation

- [Choosing a React UI kit]({{SITE}}/choosing-a-react-ui-kit)
- [Glassmorphism interfaces]({{SITE}}/react-glassmorphism-ui-kit)
- [Dashboards and settings]({{SITE}}/react-dashboard-ui-kit)
- [Editable shadcn glass components]({{SITE}}/shadcn-glass-components)
- [Install and first component]({{SITE}}/docs/install.md)
- [Published API and provider settings]({{SITE}}/docs/api.md)
- [Registry and MCP]({{SITE}}/docs/registry.md)
- [Working interface recipes]({{SITE}}/docs/recipes.md)
- [Full reference in one request]({{SITE}}/llms-full.txt)
- [Interactive catalog]({{SITE}}/)

The demonstrations use fictional local data. Their UI actions do not send messages, create accounts, connect a CRM or supply a production backend.
