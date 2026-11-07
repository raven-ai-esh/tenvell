# Choose a React UI kit around your product.

> Compare the roles of tenvell, shadcn/ui, Material UI and React Aria. Choose a React UI kit by visual style, source ownership, component scope and compatibility.

Start with the product constraints: React compatibility, the visual language you want, the controls you need and how much of the implementation you want to own. A useful shortlist separates a styled UI kit from an unstyled behavior library or a complete application framework.

## Match the visual language to the product

Tenvell is a focused option for React 19 interfaces built around thin glass, local typography and restrained interaction. It is a good candidate for cards, settings, forms and dashboard controls when that material fits the brief.

If the brief requires Material Design, a broad source-first ecosystem or primitives to style from scratch, examine the corresponding approach below. The table describes roles; it does not rank quality or claim one library wins every project.

## Check the scope you actually need

List the controls on your next real screen, then verify their exports and behavior in the candidate’s own documentation. A showcase can contain application-specific examples that are not package exports.

For tenvell, Calendar, DataTable, toast and the complete product demonstrations live in the website source. The portable core, optional Recharts shapes and individual registry items are documented separately.

## Try a small product flow

Build a labelled form or dialog in your existing application. Check keyboard navigation, focus, the chosen theme, reduced motion and contrast on the real backdrop. Run the application’s own build before expanding the integration.

Tenvell provides a starter, a runnable button example and documented form/chart recipes for this evaluation. Choose another approach when its component scope or platform compatibility better matches the product.

## Different approaches to a React UI kit

| Option | What it provides | When to consider it |
| --- | --- | --- |
| [tenvell](https://tenvell.space/docs/overview.md) | Thin-glass styled UI kit for React 19. | A shared glass material, scoped CSS and editable component source fit the product. |
| [shadcn/ui](https://ui.shadcn.com/docs) | Source-first React components and a registry ecosystem. | You want to compose and own components in an existing shadcn workflow. |
| [Material UI](https://mui.com/material-ui/getting-started/) | React components implementing Material Design, with theming and customization. | The product calls for the Material design language and its component system. |
| [React Aria](https://react-aria.adobe.com/) | Unstyled React components with interaction and accessibility behavior. | You want to supply the visual design and styling yourself. |

## Shortlist tenvell for

- React 19 applications with modern browser support.
- A consistent thin-glass style across controls, cards and overlays.
- Editable shadcn source or a scoped ESM package with local Lamina fonts.

## Use concrete selection criteria

- Verify framework and browser requirements before changing the project stack.
- Compare actual exported controls and the effort to adapt their styling.
- Treat screenshots and demonstrations as examples; validate the product flow you will ship.

## Common questions

### Which React UI kit is best?

The useful choice depends on the visual brief, component scope and project constraints. Tenvell is a focused candidate for thin-glass React 19 interfaces, with a documented API and editable source.

### Can an agent evaluate the kit?

Give it the llms.txt map and the task requirements. The map links to compatibility, exact API types, installation commands and working recipes.

## Read the reference

- [Inspect tenvell’s public API](https://tenvell.space/docs/api.md)
- [Try a small working flow](https://tenvell.space/docs/recipes.md)
- [Use the agent integration guide](https://tenvell.space/agents)

- [llms.txt](https://tenvell.space/llms.txt)

- [Install tenvell](https://tenvell.space/install)

HTML: https://tenvell.space/choosing-a-react-ui-kit
