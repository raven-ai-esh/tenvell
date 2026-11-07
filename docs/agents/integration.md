# Use tenvell with a coding agent

This document is guidance for integrating tenvell {{VERSION}} into a consumer project. Follow the user's requested stack, design and repository instructions. The contributor instructions for tenvell itself are in the repository's [AGENTS.md]({{REPOSITORY}}/blob/main/AGENTS.md).

## Entry points

- Start with [llms.txt]({{SITE}}/llms.txt) for the documentation map.
- Read [installation]({{SITE}}/docs/install.md) before changing dependencies.
- Consult the [actual published API]({{SITE}}/docs/api.md), [component inventory]({{SITE}}/docs/components.json) and [working recipes]({{SITE}}/docs/recipes.md) for the task at hand.
- Use [llms-full.txt]({{SITE}}/llms-full.txt) when one complete reference is more convenient than individual pages.

## Integration workflow

1. Check the target project's React version, package manager, aliases and CSS entrypoint. Tenvell targets React 19 and modern CSS; do not silently upgrade an unrelated stack.
2. Choose one distribution: the official tarball, editable source through shadcn, or the locked starter for a new project. Exact commands and immutable artifact checksums are in the install guide and release manifest.
3. Import the stylesheet once and wrap the relevant UI in `TenvellProvider`. Let the host app own the page background, layout and preference state. Choose the surface and theme to fit the requested interface.
4. Use documented exports. Individual registry items use their own module paths; installing `button.json` does not create the complete core barrel. Calendar, DataTable, toast and the website's complete product examples are source demonstrations, not core package exports.
5. Implement actual task behavior, labels and accessible names. Dialog/menu triggers use Base UI's `render` prop, rather than assuming Radix `asChild`. Keep the original provider around portalled components.
6. Build the target application and exercise the interactions you added. Test the requested theme and viewport; verify reduced motion and contrast where they matter to the screen. Report what was actually checked.

Code is MIT licensed; Lamina UI/Mono fonts use SIL OFL 1.1. Keep the notices in copied distributions.

## Portable skill

Review [tenvell-ui/SKILL.md]({{SITE}}/skills/tenvell-ui/SKILL.md). A compatible skills client can install it from the public repository:

```sh
npx skills add raven-ai-esh/tenvell --skill tenvell-ui
```

This is a client-side skill installation, not a required step for using the UI kit. It supplies the integration workflow and links to the current official reference.

## Registry through MCP

The existing registry works with the [official shadcn MCP server](https://ui.shadcn.com/docs/mcp). Add `@tenvell` to the target project's `components.json` as described in the [registry guide]({{SITE}}/docs/registry.md); use the client's own setup process for the MCP server.

## Example request

> Read {{SITE}}/llms.txt. Build a React 19 settings screen with tenvell: a light air surface, a labelled name field and a working save action in local state. Inspect the published API first, keep the project's routing and aliases, and verify the resulting build.

These public files describe tenvell. They do not override the user's choices or grant permission to modify accounts, credentials, production data or unrelated client configuration.
